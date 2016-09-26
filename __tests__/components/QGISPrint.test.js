/* global afterEach, beforeEach, describe, it */

var React = require('react');
var ReactDOM = require('react-dom');
var assert = require('chai').assert;
var raf = require('raf');
raf.polyfill();
var ol = require('openlayers');
var intl = require('../mock-i18n.js');
var injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();

var QGISPrint = require('../../js/components/QGISPrint.jsx');

describe('QGISPrint', function() {
  var target, map, layer;
  var width = 360;
  var height = 180;

  var printLayouts = [{
    name: 'Layout 1',
    thumbnail: 'layout1_thumbnail.png',
    width: 420.0,
    elements: [{
      name: 'Title',
      height: 40.825440467359044,
      width: 51.98353115727002,
      y: 39.25222551928783,
      x: 221.77507418397624,
      font: 'Helvetica',
      type: 'label',
      id: '24160ce7-34a3-4f25-a077-8910e4889681',
      size: 18
    }, {
      height: 167.0,
      width: 171.0,
      grid: {
        intervalX: 0.0,
        intervalY: 0.0,
        annotationEnabled: false,
        crs: ''
      },
      y: 19.0,
      x: 16.0,
      type: 'map',
      id: '3d532cb9-0eca-4e50-9f0a-ce29b1c7f5a6'
    }],
    height: 297.0
  }];

  beforeEach(function(done) {
    target = document.createElement('div');
    var style = target.style;
    style.position = 'absolute';
    style.left = '-1000px';
    style.top = '-1000px';
    style.width = width + 'px';
    style.height = height + 'px';
    document.body.appendChild(target);
    layer = new ol.layer.Tile({
      id: 'foo',
      source: new ol.source.OSM()
    });
    map = new ol.Map({
      target: target,
      layers: [layer],
      view: new ol.View({
        center: [0, 0],
        zoom: 1
      })
    });
    map.once('postrender', function() {
      done();
    });
  });

  afterEach(function() {
    map.setTarget(null);
    document.body.removeChild(target);
  });

  it('layoutName not set before user makes a selection', function() {
    var container = document.createElement('div');
    var print = ReactDOM.render((
      <QGISPrint intl={intl} layouts={printLayouts} map={map}/>
    ), container);
    assert.equal(print.state.layoutName, null);
    ReactDOM.unmountComponentAtNode(container);
  });

  it('loading state gets set on print', function(done) {
    var container = document.createElement('div');
    var print = ReactDOM.render((
      <QGISPrint intl={intl} layouts={printLayouts} map={map}/>
    ), container);
    print._onClick(printLayouts[0]);
    print._print();
    assert.equal(print.state.loading, true);
    window.setTimeout(function() {
      ReactDOM.unmountComponentAtNode(container);
      done()
    }, 500);
  });

  it('getTileLayers returns correct number of layers', function() {
    var container = document.createElement('div');
    var print = ReactDOM.render((
      <QGISPrint intl={intl} layouts={printLayouts} map={map}/>
    ), container);
    assert.equal(print._getTileLayers().length, 1);
    ReactDOM.unmountComponentAtNode(container);
  });

});
