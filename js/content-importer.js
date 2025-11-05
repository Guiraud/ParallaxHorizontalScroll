/**
 * Content Importer - Multi-format content parser
 * Supports: JSON, YAML, Markdown, XML
 *
 * Format Clarity Scores (for AI):
 * - JSON: 85% (Recommended)
 * - YAML: 75%
 * - XML: 70%
 * - Markdown: 60%
 */

class ContentImporter {
  constructor() {
    this.supportedFormats = ['json', 'yaml', 'yml', 'md', 'xml'];
  }

  /**
   * Main import method - detects format and parses accordingly
   * @param {File|string} input - File object or URL
   * @returns {Promise<Object>} Parsed content data
   */
  async import(input) {
    let content, format;

    if (input instanceof File) {
      format = this.getFormatFromFilename(input.name);
      content = await this.readFile(input);
    } else if (typeof input === 'string') {
      format = this.getFormatFromFilename(input);
      content = await this.fetchContent(input);
    } else {
      throw new Error('Invalid input type. Expected File or URL string.');
    }

    if (!this.supportedFormats.includes(format)) {
      throw new Error(`Unsupported format: ${format}`);
    }

    return this.parse(content, format);
  }

  /**
   * Parse content based on format
   */
  async parse(content, format) {
    switch (format) {
      case 'json':
        return this.parseJSON(content);
      case 'yaml':
      case 'yml':
        return this.parseYAML(content);
      case 'md':
        return this.parseMarkdown(content);
      case 'xml':
        return this.parseXML(content);
      default:
        throw new Error(`Parser not implemented for format: ${format}`);
    }
  }

  /**
   * JSON Parser - 85% clarity score
   */
  parseJSON(content) {
    try {
      const data = JSON.parse(content);
      this.validate(data);
      return data;
    } catch (error) {
      throw new Error(`JSON parsing error: ${error.message}`);
    }
  }

  /**
   * YAML Parser - 75% clarity score
   * Note: Requires js-yaml library
   */
  parseYAML(content) {
    try {
      if (typeof jsyaml === 'undefined') {
        throw new Error('js-yaml library not loaded. Include it from: https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js');
      }
      const data = jsyaml.load(content);
      this.validate(data);
      return data;
    } catch (error) {
      throw new Error(`YAML parsing error: ${error.message}`);
    }
  }

  /**
   * XML Parser - 70% clarity score
   */
  parseXML(content) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");

      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('XML parsing failed: ' + parserError.textContent);
      }

      const data = this.xmlToJSON(xmlDoc);
      this.validate(data);
      return data;
    } catch (error) {
      throw new Error(`XML parsing error: ${error.message}`);
    }
  }

  /**
   * Markdown Parser - 60% clarity score
   */
  parseMarkdown(content) {
    try {
      const data = {
        metadata: {},
        blocks: []
      };

      const lines = content.split('\n');
      let currentBlock = null;
      let currentSection = null;
      let blockCounter = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Parse metadata
        if (line.startsWith('**Type:**')) {
          data.metadata.description = line.replace('**Type:**', '').trim();
        } else if (line.startsWith('**Version:**')) {
          data.metadata.version = line.replace('**Version:**', '').trim();
        } else if (line.startsWith('**Date:**')) {
          data.metadata.created = line.replace('**Date:**', '').trim();
        }

        // Parse blocks with [BLOC ...] syntax
        if (line.startsWith('## [')) {
          if (currentBlock) {
            data.blocks.push(currentBlock);
          }

          blockCounter++;
          const match = line.match(/\[([^\]]+)\]/);
          const blockInfo = match ? match[1] : '';

          currentBlock = {
            id: `block-${blockCounter}`,
            type: this.inferBlockType(blockInfo),
            subtype: this.inferBlockSubtype(blockInfo),
            position: blockCounter,
            content: {},
            sources: []
          };

          // Extract title from line after bracket
          const title = line.replace(/##\s*\[([^\]]+)\]\s*/, '').trim();
          if (title) {
            currentBlock.content.title = title;
          }

          currentSection = 'content';
        }

        // Parse animation metadata
        else if (line.startsWith('`animation:')) {
          const animMatch = line.match(/`animation:\s*([^,]+)(?:,\s*position:\s*(\d+))?/);
          if (animMatch && currentBlock) {
            currentBlock.animation = {
              type: animMatch[1].includes('parallax') ? 'parallax' : animMatch[1],
              speed: animMatch[1].includes('slower') ? 'slower' :
                     animMatch[1].includes('faster') ? 'faster' : 'normal'
            };
            if (animMatch[2]) {
              currentBlock.position = parseInt(animMatch[2]);
            }
          }
        }

        // Parse sources
        else if (line.startsWith('**Sources:**')) {
          currentSection = 'sources';
        } else if (currentSection === 'sources' && line.startsWith('- [')) {
          const sourceMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)\s*\(([^)]+)\)/);
          if (sourceMatch && currentBlock) {
            currentBlock.sources.push({
              title: sourceMatch[1],
              url: sourceMatch[2],
              type: sourceMatch[3]
            });
          }
        }

        // Parse content text
        else if (currentBlock && currentSection === 'content' && line && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('**')) {
          if (!currentBlock.content.text) {
            currentBlock.content.text = line;
          } else {
            currentBlock.content.text += '\n' + line;
          }
        }
      }

      // Add last block
      if (currentBlock) {
        data.blocks.push(currentBlock);
      }

      // Set title from first h1
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        data.metadata.title = titleMatch[1];
      }

      this.validate(data);
      return data;
    } catch (error) {
      throw new Error(`Markdown parsing error: ${error.message}`);
    }
  }

  /**
   * Convert XML DOM to JSON structure
   */
  xmlToJSON(xmlDoc) {
    const data = {
      metadata: {},
      blocks: []
    };

    // Parse metadata
    const metadataNode = xmlDoc.querySelector('metadata');
    if (metadataNode) {
      data.metadata.title = this.getXMLText(metadataNode, 'title');
      data.metadata.description = this.getXMLText(metadataNode, 'description');
      data.metadata.version = this.getXMLText(metadataNode, 'version');
      data.metadata.created = this.getXMLText(metadataNode, 'created');
    }

    // Parse blocks
    const blockNodes = xmlDoc.querySelectorAll('blocks > block');
    blockNodes.forEach(blockNode => {
      const block = {
        id: blockNode.getAttribute('id'),
        type: blockNode.getAttribute('type'),
        subtype: blockNode.getAttribute('subtype'),
        position: parseInt(blockNode.getAttribute('position')),
        content: this.parseXMLContent(blockNode.querySelector('content')),
        sources: this.parseXMLSources(blockNode.querySelector('sources')),
      };

      // Parse animation
      const animationNode = blockNode.querySelector('animation');
      if (animationNode) {
        block.animation = {
          type: animationNode.getAttribute('type'),
          speed: animationNode.getAttribute('speed'),
          scrollDirection: animationNode.getAttribute('scrollDirection')
        };
      }

      data.blocks.push(block);
    });

    return data;
  }

  parseXMLContent(contentNode) {
    if (!contentNode) return {};

    const content = {};

    // Parse based on available child nodes
    const title = contentNode.querySelector('title');
    if (title) content.title = title.textContent;

    const text = contentNode.querySelector('text');
    if (text) content.text = text.textContent;

    const style = contentNode.querySelector('style');
    if (style) content.style = style.textContent;

    // Parse stats array
    const stats = contentNode.querySelectorAll('stats > stat');
    if (stats.length > 0) {
      content.stats = Array.from(stats).map(stat => ({
        value: stat.querySelector('value').textContent,
        label: stat.querySelector('label').textContent
      }));
    }

    // Parse items array (timeline, testimonials, faq)
    const items = contentNode.querySelectorAll('items > item');
    if (items.length > 0) {
      content.items = Array.from(items).map(item => {
        const itemData = {};
        Array.from(item.children).forEach(child => {
          itemData[child.tagName] = child.textContent;
        });
        if (item.getAttribute('speed')) {
          itemData.speed = item.getAttribute('speed');
        }
        return itemData;
      });
    }

    // Parse buttons array
    const buttons = contentNode.querySelectorAll('buttons > button');
    if (buttons.length > 0) {
      content.buttons = Array.from(buttons).map(button => ({
        text: button.querySelector('text').textContent,
        url: button.querySelector('url').textContent,
        style: button.getAttribute('style')
      }));
    }

    // Parse popups array
    const popups = contentNode.querySelectorAll('popups > popup');
    if (popups.length > 0) {
      content.popups = Array.from(popups).map(popup => ({
        id: popup.getAttribute('id'),
        trigger: popup.getAttribute('trigger'),
        message: popup.querySelector('message').textContent,
        button: {
          text: popup.querySelector('button text').textContent,
          action: popup.querySelector('button').getAttribute('action')
        }
      }));
    }

    return content;
  }

  parseXMLSources(sourcesNode) {
    if (!sourcesNode) return [];

    const sources = sourcesNode.querySelectorAll('source');
    return Array.from(sources).map(source => ({
      type: source.getAttribute('type'),
      title: source.querySelector('title').textContent,
      url: source.querySelector('url').textContent
    }));
  }

  getXMLText(parent, tagName) {
    const element = parent.querySelector(tagName);
    return element ? element.textContent : '';
  }

  /**
   * Infer block type from markdown block info
   */
  inferBlockType(blockInfo) {
    blockInfo = blockInfo.toLowerCase();
    if (blockInfo.includes('hero') || blockInfo.includes('footer')) return 'text_block';
    if (blockInfo.includes('encadré') || blockInfo.includes('cta') || blockInfo.includes('stats') || blockInfo.includes('faq')) return 'card_block';
    if (blockInfo.includes('parallax vertical')) return 'parallax_vertical';
    if (blockInfo.includes('parallax horizontal')) return 'parallax_horizontal';
    if (blockInfo.includes('popup')) return 'popup_group';
    return 'text_block';
  }

  inferBlockSubtype(blockInfo) {
    blockInfo = blockInfo.toLowerCase();
    if (blockInfo.includes('hero')) return 'hero';
    if (blockInfo.includes('footer')) return 'footer';
    if (blockInfo.includes('stats') || blockInfo.includes('chiffres')) return 'stats';
    if (blockInfo.includes('cta') || blockInfo.includes('call-to-action')) return 'call_to_action';
    if (blockInfo.includes('faq') || blockInfo.includes('objections')) return 'faq';
    if (blockInfo.includes('timeline') || blockInfo.includes('frise')) return 'timeline';
    if (blockInfo.includes('témoignages') || blockInfo.includes('testimonials')) return 'testimonials';
    return 'paragraph';
  }

  /**
   * Validate content structure
   */
  validate(data) {
    if (!data.blocks || !Array.isArray(data.blocks)) {
      throw new Error('Invalid data structure: blocks array is required');
    }

    data.blocks.forEach((block, index) => {
      if (!block.id) {
        throw new Error(`Block at index ${index} is missing required field: id`);
      }
      if (!block.type) {
        throw new Error(`Block ${block.id} is missing required field: type`);
      }
      if (!block.content) {
        throw new Error(`Block ${block.id} is missing required field: content`);
      }
    });

    return true;
  }

  /**
   * Read file content
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  }

  /**
   * Fetch content from URL
   */
  async fetchContent(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch content: ${error.message}`);
    }
  }

  /**
   * Get format from filename
   */
  getFormatFromFilename(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return extension;
  }

  /**
   * Get format clarity scores
   */
  static getFormatScores() {
    return {
      json: {
        overall: 85,
        parsing: 95,
        structure: 90,
        typing: 80,
        ambiguity: 90,
        robustness: 75,
        description: 'Optimal for AI - Clear structure, explicit typing, deterministic parsing'
      },
      yaml: {
        overall: 75,
        parsing: 70,
        structure: 85,
        typing: 70,
        ambiguity: 60,
        robustness: 70,
        description: 'Good for humans - Readable but indentation-sensitive'
      },
      xml: {
        overall: 70,
        parsing: 85,
        structure: 80,
        typing: 75,
        ambiguity: 70,
        robustness: 65,
        description: 'Good for interoperability - Verbose but standardized'
      },
      markdown: {
        overall: 60,
        parsing: 50,
        structure: 60,
        typing: 50,
        ambiguity: 55,
        robustness: 65,
        description: 'Best for documentation - Human-readable but requires semantic parsing'
      }
    };
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentImporter;
}
