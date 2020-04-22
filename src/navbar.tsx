import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';

function Navbar(props): ReactElement {
	return (
		<div>
			{props.title}
		</div>
	);
}

Navbar.propTypes = {
	title: PropTypes.string.isRequired,
};

export default Navbar;
