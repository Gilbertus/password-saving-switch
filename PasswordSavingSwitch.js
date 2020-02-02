function showStatus(enabled) {
	if ( enabled ) {
		browser.browserAction.setIcon({path: "icons/lock_on.svg"});
		browser.browserAction.setTitle({title: "Click to disable password saving"});
	}
	else {
		browser.browserAction.setIcon({path: "icons/lock_off.svg"});
		browser.browserAction.setTitle({title: "Click to enable password saving"});
	}
}

function switchSavePassword() {
	if ( !canChangePasswordSaving )
		return;
	browser.privacy.services.passwordSavingEnabled.get({}).then((got) => {
		browser.privacy.services.passwordSavingEnabled.set({value: !got.value}).then((set) => {
			if ( set )
				showStatus(!got.value);
		});
	});
};

browser.browserAction.onClicked.addListener(switchSavePassword);

let canChangePasswordSaving = false;
browser.privacy.services.passwordSavingEnabled.get({}).then((got) => {
	if ( (got.levelOfControl === "controlled_by_this_extension") || (got.levelOfControl === "controllable_by_this_extension") )
		canChangePasswordSaving = true;
	else {
		browser.browserAction.disable();
		browser.browserAction.setTitle({title: "Change restricted by browser."});
	}
	showStatus(got.value);
});


