var React = require('react/addons'),
    renderIntoDocument = React.addons.TestUtils.renderIntoDocument,
    render = require('../src/render.js').render;

describe('Render and inject state', function() {
  var component;

  class ChildComponent extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  class ParentComponent extends React.Component {
    render() {
      return React.createElement(ChildComponent, {ref: 'child'});
    }
  }

  class GrandparentComponent extends React.Component {
    render() {
      return React.createElement(ParentComponent, {ref: 'child'});
    }
  }

  beforeEach(function() {
    component = renderIntoDocument(React.createElement(GrandparentComponent));

    sinon.spy(component, 'setState');
    sinon.spy(component.refs.child, 'setState');
    sinon.spy(component.refs.child.refs.child, 'setState');

    sinon.stub(React, 'render').returns(component);
  });

  afterEach(function() {
    React.render.restore();
  });

  it('should set state on root component', function() {
    render({
      component: GrandparentComponent,
      snapshot: {
        state: {foo: 'bar'}
      }
    });

    var stateSet = component.setState.lastCall.args[0];
    expect(stateSet.foo).to.equal('bar');
  });

  it('should set state on child component', function() {
    render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: {foo: 'bar'}
          }
        }
      }
    });

    var stateSet = component.refs.child.setState.lastCall.args[0];
    expect(stateSet.foo).to.equal('bar');
  });

  it('should set state on grandchild component', function() {
    render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: {
              children: {
                child: {foo: 'bar'}
              }
            }
          }
        }
      }
    });

    var stateSet = component.refs.child.refs.child.setState.lastCall.args[0];
    expect(stateSet.foo).to.equal('bar');
  });
});
