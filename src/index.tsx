import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';

import Navbar from 'navbar';

const sleep = (ms): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

async function test(): Promise<void> {
	await sleep(3000);
	console.log('hello after 3 seconds');
}

function App(): ReactElement {
	return (
		<div>
			<Navbar title='hallo' />
			<p>hello wold</p>
			<button type='button' onClick={test}>click me</button>
		</div>
	);
}

ReactDOM.render(
	<App />
	, document.getElementById('app')
);
