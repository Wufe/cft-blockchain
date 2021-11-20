$(document)
    .on('click', '[data-anim]', function() {
        window.dataAnim = window.dataAnim || {
            resets: [],
        };
        clearTimeout(window.dataAnim.hashTimeout);
        if (window.dataAnim.resets) {
            window.dataAnim.resets.forEach(x => x());
            window.dataAnim.resets = [];
        }

        const $that = $(this);
        
        let nonce = 0;
        const setNonce = () => {
            $that.parent().find('[data-nonce]').html(++nonce);
        }

        const setHash = async (final = false) => {
            let hash = await getHash(Math.random());
            if (final)
                hash = '<strong>000000</strong>' + hash.substr(6);
            $that.find('[data-content]').html(hash);
            setNonce();
        };

        window.dataAnim.resets.push(() => setHash(true))

        let times = 0;

        const minTotalTimes = 100;
        const maxTotalTimes = 200;
        let totalTimes = (Math.floor(Math.random() * (maxTotalTimes - minTotalTimes)) +1) + minTotalTimes;

        const repeat = () => {
            const final = ++times >= totalTimes;
            setHash(final);
            if (!final) window.dataAnim.hashTimeout = setTimeout(repeat.bind(this), 50);
            if (final) {
                const linkIdentifier = $that.data('link');
                console.log({linkIdentifier})
                if (linkIdentifier) {
                    $(linkIdentifier).css('opacity', '1');
                }
            }
        };

        repeat();
    });

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

async function getHash(str) {
    return buf2hex(await crypto.subtle.digest('SHA-256', str2ab(str.toString())));
}