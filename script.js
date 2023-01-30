let paramString = document.URL.split('?code=')[1];
	const p1 = document.getElementById("code");
  const newtext = document.createTextNode(`${paramString}`);
  p1.appendChild(newtext);

const { live, xbl } = require('@xboxreplay/xboxlive-auth');

const code = `${paramString}`;
const exchangeCodeResponse = await live.exchangeCodeForAccessToken(code);

const rpsTicket = exchangeCodeResponse.access_token;
const refreshToken = exchangeCodeResponse.refresh_token; // May be undefined

const userTokenResponse = await xbl.exchangeRpsTicketForUserToken(
	rpsTicket,
	'd' // Required for custom Azure applications
);

const XSTSTokenResponse = await xbl.exchangeTokenForXSTSToken(
	userTokenResponse.Token
);

const hasExpired = new Date() >= new Date(XSTSTokenResponse.NotAfter);

if (hasExpired === true && !!refreshToken) {
	const refreshResponse = await live.refreshAccessToken(
		refreshToken,
		'3b955669-22ba-4caa-b4a2-b6ef7a8b150c',
		'XboxLive.signin XboxLive.offline_access',
		'BYe8Q~0lGrYlSavJQMzF3gDFw88dTfFSbtLdacR0'
	);
	// exchangeRpsTicketForUserToken(...)
	// exchangeTokenForXSTSToken(...)
	// etc.
}
