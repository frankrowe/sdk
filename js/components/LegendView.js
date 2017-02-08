/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import ol from 'openlayers';
import classNames from 'classnames';
import {List, ListItem} from 'material-ui/List';
import WMSLegend from './WMSLegend';
import Paper from 'material-ui/Paper';
import ArcGISRestLegend from './ArcGISRestLegend';
import Label from './Label';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import {findLayerById} from '../state/layers/reducers';
import './Legend.css';

const messages = defineMessages({
  header: {
    id: 'legend.header',
    description: 'Header for the legend component',
    defaultMessage: 'Legend'
  },
  emptyheader: {
    id: 'legend.emptyheader',
    description: 'Header for the legend component if no entries',
    defaultMessage: 'No legend available'
  }
});

/**
 * Legend component that can show legend graphic for WMS layers only currently.
 *
 * ```xml
 * <Legend map={map} />
 * ```
 *
 * ![Legend](../Legend.png)
 */
class LegendView extends React.PureComponent {
  static propTypes = {
    /**
     * Options to send to the WMS legend. See WMSLegend component.
     */
    wmsOptions: React.PropTypes.object,
    /**
     * Css class name to apply on the root element of this component.
     */
    className: React.PropTypes.string,
    /**
     * @ignore
     */
    intl: intlShape.isRequired
  };

  render() {
    const {formatMessage} = this.props.intl;
    var legends = [];
    for (var i = 0, ii = this.props.layers.length; i < ii; ++i) {
      var lyr = this.props.layers[i];
      var layer = findLayerById(lyr.id);
      if (layer.getVisible()) {
        if ((layer instanceof ol.layer.Tile && layer.getSource() instanceof ol.source.TileWMS) ||
          (layer instanceof ol.layer.Image && layer.getSource() instanceof ol.source.ImageWMS) ||
          (layer instanceof ol.layer.Tile && layer.getSource() instanceof ol.source.TileArcGISRest)) {
          var primaryText = layer.get('emptyTitle') ? (<div className='layer-title-empty'>{layer.get('title')}</div>) : layer.get('title');
          if (layer.getSource() instanceof ol.source.TileWMS || layer.getSource() instanceof ol.source.ImageWMS) {
            legends.push(<ListItem key={'legend-' + layer.get('id')} disableTouchRipple={true}><div>{primaryText}</div><WMSLegend  className='legend-list-img' {...this.props.wmsOptions} layer={layer} /></ListItem>);
          } else if (layer.getSource() instanceof ol.source.TileArcGISRest) {
            legends.push(<ListItem key={'legend-' + layer.get('id')} disableTouchRipple={true}><div>{primaryText}</div><ArcGISRestLegend className='legend-list-img' layer={layer} /></ListItem>);
          }
        }
      }
    }
    var subHeader = legends.length === 0 ? (<Paper zDepth={0} className='legend-header'><Label>{formatMessage(messages.emptyheader)}</Label></Paper>) : undefined;
    return (
      <Paper zDepth={0} className={classNames('sdk-component legend', this.props.className)}>
        {subHeader}
        <List className='legend-list'>{legends}</List>
      </Paper>
    );
  }
}

export default injectIntl(LegendView);
