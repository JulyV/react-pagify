import React from 'react';
import merge from 'lodash/merge';

const defaultTags = {
  container: {
    tag: 'div',
    props: {}
  },
  segment: {
    tag: 'div',
    props: {}
  },
  ellipsis: {
    tag: 'div',
    props: {
      children: '…'
    }
  },
  link: {
    tag: 'span',
    props: {}
  },
  linkPrevNext: {
      tag: 'span',
      props: {}
  }
};

class Context extends React.Component {
  getChildContext() {
    return {
      segments: this.props.segments,
      onSelect: this.props.onSelect,
      tags: this.tags
    };
  }
  get tags() {
    return merge({}, defaultTags, this.props.tags);
  }
  render() {
    const {onSelect, segments, tags, ...props} = this.props; // eslint-disable-line max-len, no-unused-vars
    const Container = this.tags.container;

    return <Container.tag {...Container.props} {...props}>{this.props.children}</Container.tag>;
  }
}
Context.propTypes = {
  children: React.PropTypes.any,
  onSelect: React.PropTypes.func,
  segments: React.PropTypes.object,
  tags: React.PropTypes.object
};
Context.childContextTypes = {
  onSelect: React.PropTypes.func,
  segments: React.PropTypes.object,
  tags: React.PropTypes.object
};

class Segment extends React.Component {
  render() {
    const context = this.context;
    const { field, ...props } = this.props;
    const segments = context.segments;
    const onSelect = context.onSelect;
    const tags = context.tags;
    const Tag = tags.segment.tag;
    const Link = tags.link.tag;
    const pages = segments[field];

    return (<Tag {...tags.segment.props} {...props}>{pages.map((page) =>
      <Link
        {...tags.link.props}
        key={`page-${page}`}
        onClick={(e) => onSelect(page, e)}>{page}</Link>
    )}</Tag>);
  }
}
Segment.propTypes = {
  field: React.PropTypes.string.isRequired
};
Segment.contextTypes = {
  onSelect: React.PropTypes.func,
  segments: React.PropTypes.object,
  tags: React.PropTypes.object
};

class Button extends React.Component {
  render() {
    const context = this.context;
    const { page, children, ...props } = this.props;
    const onSelect = context.onSelect;
    const tags = context.tags;
    const Tag = tags.segment.tag;
    const Link = tags.link.tag;

    return (<Tag {...tags.segment.props} {...props}>
      <Link
        {...tags.link.props}
        onClick={(e) => onSelect(page, e)}>{children}</Link>
    </Tag>);
  }
}
Button.propTypes = {
  children: React.PropTypes.any,
  page: React.PropTypes.number.isRequired
};
Button.contextTypes = {
  onSelect: React.PropTypes.func,
  tags: React.PropTypes.object
};

class ButtonPrevNext extends React.Component {
  render() {
    const context = this.context;
    const { page, children, ...props } = this.props;
    const onSelect = context.onSelect;
    const tags = context.tags;
    const Tag = tags.segment.tag;
    const Link = tags.linkPrevNext.tag;

    return (<Tag {...tags.segment.props} {...props}>
      <Link
            {...tags.linkPrevNext.props}
        onClick={(e) => onSelect(page, e)}>{children}</Link>
    </Tag>);
        }
        }
ButtonPrevNext.propTypes = {
    children: React.PropTypes.any,
    page: React.PropTypes.number.isRequired
};
ButtonPrevNext.contextTypes = {
    onSelect: React.PropTypes.func,
    tags: React.PropTypes.object
};

class Ellipsis extends React.Component {
  render() {
    const context = this.context;
    const { previousField, nextField, ...props } = this.props;
    const segments = context.segments;
    const tags = context.tags;
    const Tag = tags.ellipsis.tag;
    const previousPages = segments[previousField];
    const nextPages = segments[nextField];
    const showEllipsis = nextPages[0] - previousPages.slice(-1)[0] > 1;

    if(showEllipsis) {
      return <Tag {...tags.ellipsis.props} {...props}/>;
    }

    return null;
  }
}
Ellipsis.propTypes = {
  children: React.PropTypes.any,
  previousField: React.PropTypes.string.isRequired,
  nextField: React.PropTypes.string.isRequired,
};
Ellipsis.contextTypes = {
  segments: React.PropTypes.object,
  tags: React.PropTypes.object
};

export default {
  Context,
  Segment,
  Button,
  Ellipsis,
  ButtonPrevNext
};
