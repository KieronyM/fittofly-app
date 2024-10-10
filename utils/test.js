(function () {
	function findEventsInIframe() {
		const iframe = Array.from(document.getElementsByTagName("iframe")).find(
			(frame) => frame.src && frame.src.includes("/eCrew/Dashboard/HomeIndex"),
		);

		if (iframe && iframe.contentDocument) {
			const scripts = iframe.contentDocument.getElementsByTagName("script");
			for (let i = 0; i < scripts.length; i++) {
				const scriptContent = scripts[i].textContent || scripts[i].innerText;
				const match = scriptContent.match(
					/var\\s+events\\s*=\\s*(\\[.*?\\]);/s,
				);
				if (match) {
					const eventsData = JSON.parse(match[1]);

					window.ReactNativeWebView.postMessage(
						JSON.stringify({
							type: "events",
							data: eventsData,
						}),
					);

					// Filter for IDs of type Flight and Default
					const filteredIds = eventsData
						.filter(
							(event) => event.type === "Flight" || event.type === "Default",
						)
						.map((event) => event.id);

					filteredIds.forEach((id) => {
						const header = {
							id,
							calledfrom: 1,
							crewID: "A",
							timesIn: "2",
							Port: "",
							HotelIndex: "",
							HotelInfo: {},
						};

						const encodedHeader = btoa(JSON.stringify(header))
							.replace(/=/g, "")
							.replace(/\+/g, "-")
							.replace(/\//g, "_");

						const encodedPayload = btoa(JSON.stringify({}))
							.replace(/=/g, "")
							.replace(/\+/g, "-")
							.replace(/\//g, "_");

						const token = encodedHeader + "." + encodedPayload;

						EcallUrlAsync(
							"/eCrew/DutyDetails/Index",
							{
								dt: token,
							},
							"get",
							function (response) {
								console.log(response.text());
								window.ReactNativeWebView.postMessage(
									JSON.stringify({
										type: "dutyDetails",
										data: {
											id: id,
											details: response.text(),
										},
									}),
								);
							},
						);
					});
				}
			}
		}

		// If not found, check again after a short delay
		setTimeout(findEventsInIframe, 500);
	}

	// Start looking for the iframe and events
	findEventsInIframe();

	// Also send location information as before
	window.ReactNativeWebView.postMessage(
		JSON.stringify({
			type: "location",
			data: window.location,
		}),
	);
})();
