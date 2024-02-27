if (!(typeof window === 'object'
    && window && window.opener && window.opener !== window
    && window.location && window.location.href)) {
    throw new Error('The \'window\' reference is invalid');
}
const query = (new URL(window.location.href)).searchParams;
const [code, error] = [query.get('code'), query.get('error')];
window.opener.postMessage(JSON.stringify({ code, error }), window.location.origin);
