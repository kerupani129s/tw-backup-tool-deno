const getID = userNode => {
	try {
		const followButtonElement = userNode.querySelector('div[role="button"][data-testid]');
		const id = followButtonElement.dataset.testid.match(/^([0-9]+)-/)[1];
		return id;
	} catch {
		return;
	}
};

const getUsers = (cellsElement, users) => {

	const userNodes = cellsElement.querySelectorAll('div[data-testid="UserCell"]');

	if ( ! userNodes ) return;

	for (const userNode of userNodes) {
		const id = getID(userNode);
		if ( typeof id === 'undefined' ) continue;
		if ( users.every(user => user.id !== id) ) {
			users.push({
				id,
				html: userNode.outerHTML,
			});
		}
	}

};

const saveUsers = cellsElement => {

	const usersType = location.pathname.match(/^\/[^/]+\/(followers|following)$/)?.[1];

	if ( ! usersType ) return;

	// 
	const users = [];

	// 
	const saveButtonElement = document.createElement('button');
	saveButtonElement.type = 'button';
	saveButtonElement.textContent = 'Save';
	saveButtonElement.style = 'height: 32px;';

	cellsElement.appendChild(saveButtonElement);

	saveButtonElement.addEventListener('click', () => {

		console.log(`User count: ${users.length}`);

		const json = JSON.stringify(users, null, 4);
		const blob = new Blob([json], { type: 'application/json' });

		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `${usersType}.json`;
		a.click();

	});

	// 
	scrollTo(0, 0);

	const observer = new MutationObserver(() => {
		getUsers(cellsElement, users);
	})

	observer.observe(cellsElement, {
		subtree: true,
		childList: true,
	});

	getUsers(cellsElement, users);

};

// 
const cellsElement = document.querySelector('h1[aria-level="1"] + div[aria-label]');

const tabNodes = document.querySelectorAll('[role="tab"]');

const observer = new MutationObserver(() => {
	saveUsers(cellsElement);
})

for (const tabNode of tabNodes) {
	observer.observe(tabNode, {
		attributeFilter: ['aria-selected'],
	});
}

saveUsers(cellsElement);

setInterval(
	() => {
		scrollBy(0, 48);
	},
	100,
);
