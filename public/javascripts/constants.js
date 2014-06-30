angular.module("tulaVotes.constants", [])
	.constant("NOTIFICATION_TYPES",{
		info: {
			class: "info",
			title: "Note!"
		},
		warning: {
			class: "warning",
			title: "Warning!"
		},
		success: {
			class: "success",
			title: "Success!"
		},
		error: {
			class: "danger",
			title: "Error!"
		}
	});