import React from 'react';
import { Panel } from 'react-bootstrap';
import { LineChart } from 'react-d3';
import Dimensions from 'react-dimensions'
import { isEmpty } from 'lodash';

class SimpleGraph extends React.Component {
	render() {
		const { series, containerWidth } = this.props;
		const width = containerWidth - 40;
		const viewBoxObject = {
			x: 0,
			y: 0,
			width,
			height: width / 2
		};

		return (
			<Panel header="Graph">
				<LineChart
					legend={true}
					data={series}
					width={viewBoxObject.width}
					height={viewBoxObject.height}
					viewBoxObject={viewBoxObject}
					yAxisLabel="Best"
					xAxisLabel="Elapsed Iteration"
					gridHorizontal={true} />
			</Panel>
		);
	}
}

export const Graph = Dimensions()(SimpleGraph);