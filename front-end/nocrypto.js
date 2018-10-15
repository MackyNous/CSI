/*
Copyright (c) 2018 Pum Walters, HvA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This software is created for educational purposes and should 
never be used in a production environment


vn: version
hxc: hex characters
idc: id characters
pwc: password characters
hxcl, idcl, pwcl: lengths
pick: random choose
npick: multiple random choose
mkGuid: rand guid
mkID: rand ID
mkPw: rand pw
mkKey: rand key
rdc, map: shorthands Array.prototype map & reduce
reverse: reverse list
i: 71
enc: simple cipher starting at 71 modulo 31
dec: decrypt
chash: commutative hash
myPrivateSecret: local var for key exchange
myPublicSecret:  local var for key exchange
myHalfSecret:  local var for key exchange
mySharedSecret:  local var for key exchange
asList: encrypt to list of char
asString: encrypt to string
split: split chars in heigh digit/low digit of two digit decimal code (in pwc)
tangle: reverse of split
mask: encrypt using shared secret
unmask: reverse
encrypt: str-to-str encrypt
decrypt: reverse
encrypt64: encrypts arbitrary string, 1st to pwc, then using encrypt
decrypt64: reverse

This object exports these visible functions

vn, hxc, idc, pwc, pick, npick, mkGuid, mkID, reverse, chash, 
myPrivateSecret, mySharedSecret, encrypt, decrypt, encrypt64, decrypt64
*/

(function() {
	var nocrypto = (() => {
		var //version
			vn = '0.0.1',
			hxc = "0123456789"+ "abcdef",
			idc = hxc+"ghijklmnopqrstuvwxyz"+"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			pwc = idc+"!#$%&()*+,-./:;<=>?@[]^_{|}~",
			hxcl = hxc.length, idcl = idc.length, pwcl = pwc.length,
			pick = (a) => a[Math.floor(Math.random() * a.length)],
			npick = (a,n) => Array.from({length: n}, () => pick(a)).join(''),
			mkGuid = () => npick(hxc,8)+'-'+npick(hxc,4)+'-'+npick(hxc,4)+'-'+npick(hxc,12),
			mkID = () => npick(idc,8),
			mkPw = () => npick(pwc,12),
			mkKey = (n) => npick(pwc,n),
			secret = () => mkKey(64),
			rdc = Array.prototype.reduce,
			map = Array.prototype.map,
			reverse = (s) => Array.prototype.reduceRight.call(s,(a,c)=>a+c,''),
			i=71, 
			mod = (n, m)  => ((n % m) + m) % m,
			enc = ((i) => rdc.call(pwc,(a,c) => { a[c]=(i=mod(i+31,pwcl)); return a },{}))(71),
			dec = ((i) => rdc.call(pwc,(a,c) => { a[i=mod(i+31,pwcl)]=c; return a },[]))(71),
			chash = (a,b) => { var bl=b.length; return rdc.call(b,
			  (ac,c,i) => { ac += dec[mod(enc[a[mod(i,a.length)]]+enc[c]+enc[b[mod(i+13,bl)]]+
								  enc[b[mod(i+71,bl)]],pwcl)]; return ac },'')},
			asList = (m) => map.call(m,(c) => enc[c]),
			asString = (m) => rdc.call(m,(a,c) => a+=dec[c],''),
			split = (Aa) => rdc.call(Aa,(a,c) => { a[0].push(Math.floor(c/10));a[1].push(mod(c,10));return a;},[[],[]]),
			merge = ([a,b]) => a.map((c,i) => 10*c+b[mod(i,b.length)])
			shift = ([a,b],n) => [a.map((c,i) => a[mod(i+n,a.length)]),b],
			tangle = ([a,b],n) => map.call(a,(c,i) => 10*c+b[mod(b.length+n+i,b.length)]),


			mask = (a,scrt) => map.call(a,(c,i) => mod(c+enc[scrt[mod(i,64)]],pwcl)),
			unmask = (a,scrt) => map.call(a,(c,i) => mod(pwcl+c-enc[scrt[i%64]],pwcl)),
			
			mangle = (m,n,s) => tangle(split(mask(tangle(split(m),n),s)),-n),
			unmangle = (m,n,s) => tangle(split(unmask(tangle(split(m),n),s)),-n)

			encryptPW = (m,scrt) => asString(mangle(asList(m),Math.floor(m.length/2),scrt)),
			decryptPW = (m,scrt) => asString(unmangle(asList(m),Math.floor(m.length/2),scrt)),
			encrypt = (m,scrt) => b2a(encryptPW(b2a(m),scrt)),
			decrypt = (m,scrt) => a2b(decryptPW(a2b(m),scrt));
				
			ofst = (a,b,n) => a.map((c,i) => mod(c+b[mod(i,b.length)],n)),
			invt = (a,n) => a.map((c) => mod(n-c,n)),
			shft = (a,n) => a.map((c,i) => a[mod(i+n,a.length)]),
			ncodePW = (m,puk) => {
				var [A,a] = split(asList(m)),
					[U,u] = split(asList(puk)),
					B = shft(ofst(shft(A,23),shft(U,5),9),-11),
					b = shft(ofst(shft(a,-17),shft(u,-7),10),13)
				return asString(merge([B,b]))
			},
			ncode =(m,puk) => b2a(ncodePW(b2a(m),puk)),
			dcodePW = (m,prik) => {
				var [A,a] = split(asList(m)),
					[U,u] = split(asList(prik)),
					B = shft(ofst(shft(A,11),shft(U,7),9),-23),
					b = shft(ofst(shft(a,-13),shft(u,-5),10),17)
				return asString(merge([B,b]))
			},
			dcode =(m,prik) => a2b(dcodePW(a2b(m),prik)),
			ppks = () => {
				var secr = asList(secret()),
					[U,u] = split(secr),
					R = invt(U,9),
					r = invt(u,10),
					puk = asString(merge([shft(U,-5),shft(u,7)])),
					prik = asString(merge([shft(R,-7),shft(r,5)]))
				return {puk:puk,prik:prik}
			}

		return { vn:vn,
			hxc:hxc, idc:idc, pwc:pwc,
			pick: pick, npick: npick,
			mkGuid: mkGuid,	mkID: mkID,	mkPw: mkPw,	mkKey: mkKey,
			reverse: reverse, chash: chash, 
			secret: secret, encrypt: encrypt,decrypt: decrypt,
			encryptPW: encryptPW, decryptPW: decryptPW,
			ppks: ppks, ncode: ncode, dcode: dcode,
			ncodePW: ncodePW, dcodePW: dcodePW
		}	
	})()

//Source: http://jsfiddle.net/1okoy0r0

function b2a(a) {
  var c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
  if (!a) return a;
  do c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e, 
  f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < a.length);
  return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) :m) + "===".slice(o || 3);
}

function a2b(a) {
  var b, c, d, e = {}, f = 0, g = 0, h = "", i = String.fromCharCode, j = a.length;
  for (b = 0; 64 > b; b++) e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
  for (c = 0; j > c; c++) for (b = e[a.charAt(c)], f = (f << 6) + b, g += 6; g >= 8; ) ((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h += i(d));
  return h;
}

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {//node
		module.exports = nocrypto;
	} else {//browser
		window.nocrypto = nocrypto;
	}
})();

