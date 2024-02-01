const documentationHelpers = {
    loginProperties: [
        {
            name: "Open in popup",
            id: 'use-popup'
        },
        {
            name: "Force one step login",
            id: "one-step-login"
        },
        {
            name: "Start new Flow",
            id: "start-new-flow"
        }
    ],
    authenticationMethods: [
        "Force password",
        "Code generator",
        "SMS code",
    ],
    sdkMethods: {
        identity: [
            'login',
            'logSettings',
            'hasSession',
            'isLoggedIn',
            'clearCachedUserSession',
            'isConnected',
            'getUser',
            'getUserId',
            'getExternalId',
            'getUserSDRN',
            'getUserUuid',
            'getUserContextData',
            'getSpId',
            'logout',
            'loginUrl',
            'logoutUrl',
            'accountUrl',
            'phonesUrl',
        ],
        monetization: [
            'hasAccess',
            'clearCachedAccessResult',
            'subscriptionsUrl',
            'productsUrl',
        ],
        payment: [
            'payWithPaylink',
            'purchaseHistoryUrl',
            'redeemUrl',
            'purchasePaylinkUrl -deprecated-',
            'purchaseProductFlowUrl',
            'purchaseCampaignFlowUrl',
            'purchasePromoCodeProductFlowUrl -deprecated-',
        ]
    }
}

module.exports = {documentationHelpers}
