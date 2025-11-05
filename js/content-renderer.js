/**
 * Content Renderer - Renders imported content into Parallax HTML
 */

class ContentRenderer {
  constructor(container) {
    this.container = container || document.querySelector('.horizontal-scroll-wrapper');
  }

  /**
   * Main render method
   */
  render(data) {
    if (!data || !data.blocks) {
      throw new Error('Invalid data: blocks array is required');
    }

    // Clear existing content (optional - keep original for demo)
    // this.container.innerHTML = '';

    // Sort blocks by position
    const sortedBlocks = data.blocks.sort((a, b) => a.position - b.position);

    // Render each block
    sortedBlocks.forEach(block => {
      const element = this.createBlockElement(block);
      if (element) {
        this.container.appendChild(element);
      }
    });

    // Initialize popups if present
    const popupBlocks = sortedBlocks.filter(b => b.type === 'popup_group');
    if (popupBlocks.length > 0) {
      popupBlocks.forEach(block => this.initializePopups(block));
    }

    return this.container;
  }

  /**
   * Create block element based on type
   */
  createBlockElement(block) {
    switch (block.type) {
      case 'text_block':
        return this.createTextBlock(block);
      case 'card_block':
        return this.createCardBlock(block);
      case 'parallax_vertical':
        return this.createParallaxVertical(block);
      case 'parallax_horizontal':
        return this.createParallaxHorizontal(block);
      case 'popup_group':
        return null; // Handled separately
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  }

  /**
   * Create text block
   */
  createTextBlock(block) {
    const wrapper = document.createElement('div');
    wrapper.className = 'img-wrapper content-block text-block';
    wrapper.id = block.id;

    // Apply animation
    this.applyAnimation(wrapper, block.animation);

    const content = document.createElement('div');
    content.className = `text-content ${block.subtype || ''}`;

    if (block.content.title) {
      const title = document.createElement('h2');
      title.textContent = block.content.title;
      title.className = 'block-title';
      content.appendChild(title);
    }

    if (block.content.text) {
      const text = document.createElement('div');
      text.className = 'block-text';
      text.innerHTML = this.formatText(block.content.text);
      content.appendChild(text);
    }

    // Add sources
    if (block.sources && block.sources.length > 0) {
      content.appendChild(this.createSourcesElement(block.sources));
    }

    wrapper.appendChild(content);
    return wrapper;
  }

  /**
   * Create card block (stats, CTA, FAQ)
   */
  createCardBlock(block) {
    const wrapper = document.createElement('div');
    wrapper.className = 'img-wrapper content-block card-block';
    wrapper.id = block.id;

    // Apply animation
    this.applyAnimation(wrapper, block.animation);

    const card = document.createElement('div');
    card.className = `card ${block.subtype || ''}`;

    if (block.content.title) {
      const title = document.createElement('h2');
      title.textContent = block.content.title;
      title.className = 'card-title';
      card.appendChild(title);
    }

    // Render based on subtype
    switch (block.subtype) {
      case 'stats':
        card.appendChild(this.createStatsContent(block.content));
        break;
      case 'call_to_action':
        card.appendChild(this.createCTAContent(block.content));
        break;
      case 'faq':
        card.appendChild(this.createFAQContent(block.content));
        break;
      default:
        if (block.content.text) {
          const text = document.createElement('div');
          text.className = 'card-text';
          text.innerHTML = this.formatText(block.content.text);
          card.appendChild(text);
        }
    }

    // Add sources
    if (block.sources && block.sources.length > 0) {
      card.appendChild(this.createSourcesElement(block.sources));
    }

    wrapper.appendChild(card);
    return wrapper;
  }

  /**
   * Create stats content
   */
  createStatsContent(content) {
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';

    if (content.stats) {
      content.stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.className = 'stat-item';

        const value = document.createElement('div');
        value.className = 'stat-value';
        value.textContent = stat.value;

        const label = document.createElement('div');
        label.className = 'stat-label';
        label.textContent = stat.label;

        statElement.appendChild(value);
        statElement.appendChild(label);
        statsContainer.appendChild(statElement);
      });
    }

    return statsContainer;
  }

  /**
   * Create CTA content
   */
  createCTAContent(content) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'cta-container';

    if (content.text) {
      const text = document.createElement('div');
      text.className = 'cta-text';
      text.innerHTML = this.formatText(content.text);
      ctaContainer.appendChild(text);
    }

    if (content.buttons) {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'cta-buttons';

      content.buttons.forEach(button => {
        const btn = document.createElement('a');
        btn.href = button.url;
        btn.textContent = button.text;
        btn.className = `cta-button ${button.style || 'default'}`;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        buttonsContainer.appendChild(btn);
      });

      ctaContainer.appendChild(buttonsContainer);
    }

    return ctaContainer;
  }

  /**
   * Create FAQ content
   */
  createFAQContent(content) {
    const faqContainer = document.createElement('div');
    faqContainer.className = 'faq-container';

    if (content.items) {
      content.items.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';

        const question = document.createElement('div');
        question.className = 'faq-question';
        question.textContent = item.question;
        question.onclick = () => this.toggleFAQ(index);

        const answer = document.createElement('div');
        answer.className = 'faq-answer';
        answer.textContent = item.answer;
        answer.id = `faq-answer-${index}`;

        faqItem.appendChild(question);
        faqItem.appendChild(answer);
        faqContainer.appendChild(faqItem);
      });
    }

    return faqContainer;
  }

  /**
   * Create parallax vertical (timeline)
   */
  createParallaxVertical(block) {
    const wrapper = document.createElement('div');
    wrapper.className = 'img-wrapper content-block parallax-vertical';
    wrapper.id = block.id;

    this.applyAnimation(wrapper, block.animation);

    const timeline = document.createElement('div');
    timeline.className = 'timeline';

    if (block.content.title) {
      const title = document.createElement('h2');
      title.textContent = block.content.title;
      title.className = 'timeline-title';
      timeline.appendChild(title);
    }

    if (block.content.items) {
      block.content.items.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        const year = document.createElement('div');
        year.className = 'timeline-year';
        year.textContent = item.year;

        const itemTitle = document.createElement('div');
        itemTitle.className = 'timeline-item-title';
        itemTitle.textContent = item.title;

        const description = document.createElement('div');
        description.className = 'timeline-description';
        description.textContent = item.description;

        timelineItem.appendChild(year);
        timelineItem.appendChild(itemTitle);
        timelineItem.appendChild(description);
        timeline.appendChild(timelineItem);
      });
    }

    wrapper.appendChild(timeline);
    return wrapper;
  }

  /**
   * Create parallax horizontal (testimonials)
   */
  createParallaxHorizontal(block) {
    const container = document.createElement('div');
    container.className = 'parallax-horizontal-container';
    container.id = block.id;

    if (block.content.title) {
      const title = document.createElement('h2');
      title.textContent = block.content.title;
      title.className = 'testimonials-title';
      container.appendChild(title);
    }

    if (block.content.items) {
      block.content.items.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'img-wrapper testimonial-wrapper';

        // Apply speed from animation or item
        const speed = (block.animation && block.animation.speeds && block.animation.speeds[index]) || 'normal';
        if (speed !== 'normal') {
          wrapper.classList.add(speed);
        }

        const testimonial = document.createElement('div');
        testimonial.className = 'testimonial';

        if (item.quote) {
          const quote = document.createElement('blockquote');
          quote.className = 'testimonial-quote';
          quote.textContent = `"${item.quote}"`;
          testimonial.appendChild(quote);
        }

        if (item.author) {
          const author = document.createElement('cite');
          author.className = 'testimonial-author';
          author.textContent = `— ${item.author}`;
          testimonial.appendChild(author);
        }

        if (item.image && item.image !== 'null') {
          const img = document.createElement('img');
          img.src = item.image;
          img.alt = item.author || 'Testimonial';
          img.className = 'testimonial-image';
          testimonial.insertBefore(img, testimonial.firstChild);
        }

        wrapper.appendChild(testimonial);
        container.appendChild(wrapper);
      });
    }

    return container;
  }

  /**
   * Initialize popups
   */
  initializePopups(block) {
    if (!block.content.popups) return;

    block.content.popups.forEach(popup => {
      switch (popup.trigger) {
        case 'scroll_50':
          this.setupScrollPopup(popup, 50);
          break;
        case 'time_30s':
          this.setupTimedPopup(popup, 30000);
          break;
        case 'after_signature':
          // Implement based on your signature tracking
          console.log('Signature popup ready:', popup.id);
          break;
        default:
          console.warn(`Unknown popup trigger: ${popup.trigger}`);
      }
    });
  }

  setupScrollPopup(popup, percentage) {
    let triggered = false;
    window.addEventListener('scroll', () => {
      if (triggered) return;

      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= percentage) {
        this.showPopup(popup);
        triggered = true;
      }
    });
  }

  setupTimedPopup(popup, delay) {
    setTimeout(() => {
      this.showPopup(popup);
    }, delay);
  }

  showPopup(popup) {
    const popupElement = document.createElement('div');
    popupElement.className = 'popup-overlay';
    popupElement.innerHTML = `
      <div class="popup-content">
        <button class="popup-close">&times;</button>
        <p class="popup-message">${popup.message}</p>
        <button class="popup-button" data-action="${popup.button.action}">
          ${popup.button.text}
        </button>
      </div>
    `;

    document.body.appendChild(popupElement);

    // Close button
    popupElement.querySelector('.popup-close').onclick = () => {
      popupElement.remove();
    };

    // Action button
    popupElement.querySelector('.popup-button').onclick = () => {
      this.handlePopupAction(popup.button.action);
      popupElement.remove();
    };
  }

  handlePopupAction(action) {
    switch (action) {
      case 'scroll_to_cta':
        const cta = document.querySelector('[id*="cta"]');
        if (cta) cta.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'copy_link':
        navigator.clipboard.writeText(window.location.href);
        alert('Lien copié !');
        break;
      case 'open_faq':
        const faq = document.querySelector('[id*="faq"], [id*="objections"]');
        if (faq) faq.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }

  /**
   * Create sources element
   */
  createSourcesElement(sources) {
    const sourcesDiv = document.createElement('div');
    sourcesDiv.className = 'sources';

    const title = document.createElement('h4');
    title.textContent = 'Sources :';
    sourcesDiv.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'sources-list';

    sources.forEach(source => {
      const item = document.createElement('li');
      item.className = 'source-item';

      const type = document.createElement('span');
      type.className = 'source-type';
      type.textContent = `[${source.type}]`;

      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.title;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      item.appendChild(type);
      item.appendChild(document.createTextNode(' '));
      item.appendChild(link);
      list.appendChild(item);
    });

    sourcesDiv.appendChild(list);
    return sourcesDiv;
  }

  /**
   * Apply animation classes
   */
  applyAnimation(element, animation) {
    if (!animation) return;

    if (animation.speed) {
      element.classList.add(animation.speed);
    }

    if (animation.type === 'parallax_vertical') {
      element.classList.add('vertical');
    }
  }

  /**
   * Format text (convert line breaks to <br>)
   */
  formatText(text) {
    return text.replace(/\n/g, '<br>');
  }

  /**
   * Toggle FAQ visibility
   */
  toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    if (answer) {
      answer.classList.toggle('active');
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentRenderer;
}
