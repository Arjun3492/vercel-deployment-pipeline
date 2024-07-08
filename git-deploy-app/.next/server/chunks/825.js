"use strict";exports.id=825,exports.ids=[825],exports.modules={6825:(e,s,t)=>{t.d(s,{fromSSO:()=>k});var o=t(3145),r=t(6683);let i=e=>e&&("string"==typeof e.sso_start_url||"string"==typeof e.sso_account_id||"string"==typeof e.sso_session||"string"==typeof e.sso_region||"string"==typeof e.sso_role_name);var n=t(13);class a extends n.k{constructor(e,s=!0){super(e,s),this.name="TokenProviderError",Object.setPrototypeOf(this,a.prototype)}}let l="To refresh this SSO session run 'aws sso login' with the corresponding profile.",c={},w=async e=>{let{SSOOIDCClient:s}=await t.e(21).then(t.bind(t,21));if(c[e])return c[e];let o=new s({region:e});return c[e]=o,o},g=async(e,s)=>{let{CreateTokenCommand:o}=await t.e(21).then(t.bind(t,21));return(await w(s)).send(new o({clientId:e.clientId,clientSecret:e.clientSecret,refreshToken:e.refreshToken,grantType:"refresh_token"}))},f=e=>{if(e.expiration&&e.expiration.getTime()<Date.now())throw new a(`Token is expired. ${l}`,!1)},h=(e,s,t=!1)=>{if(void 0===s)throw new a(`Value not present for '${e}' in SSO Token${t?". Cannot refresh":""}. ${l}`,!1)},{writeFile:d}=t(7147).promises,u=(e,s)=>d((0,r.Py)(e),JSON.stringify(s,null,2)),p=new Date(0),S=(e={})=>async()=>{let s;e.logger?.debug("@aws-sdk/token-providers - fromSso");let t=await (0,r.MX)(e),o=(0,r.Jl)(e),i=t[o];if(i){if(!i.sso_session)throw new a(`Profile '${o}' is missing required property 'sso_session'.`)}else throw new a(`Profile '${o}' could not be found in shared credentials file.`,!1);let n=i.sso_session,c=(await (0,r.G)(e))[n];if(!c)throw new a(`Sso session '${n}' could not be found in shared credentials file.`,!1);for(let e of["sso_start_url","sso_region"])if(!c[e])throw new a(`Sso session '${n}' is missing required property '${e}'.`,!1);c.sso_start_url;let w=c.sso_region;try{s=await (0,r.gH)(n)}catch(e){throw new a(`The SSO session token associated with profile=${o} was not found or is invalid. ${l}`,!1)}h("accessToken",s.accessToken),h("expiresAt",s.expiresAt);let{accessToken:d,expiresAt:S}=s,m={token:d,expiration:new Date(S)};if(m.expiration.getTime()-Date.now()>3e5)return m;if(Date.now()-p.getTime()<3e4)return f(m),m;h("clientId",s.clientId,!0),h("clientSecret",s.clientSecret,!0),h("refreshToken",s.refreshToken,!0);try{p.setTime(Date.now());let e=await g(s,w);h("accessToken",e.accessToken),h("expiresIn",e.expiresIn);let t=new Date(Date.now()+1e3*e.expiresIn);try{await u(n,{...s,accessToken:e.accessToken,expiresAt:t.toISOString(),refreshToken:e.refreshToken})}catch(e){}return{token:e.accessToken,expiration:t}}catch(e){return f(m),m}},m=async({ssoStartUrl:e,ssoSession:s,ssoAccountId:i,ssoRegion:n,ssoRoleName:a,ssoClient:l,clientConfig:c,profile:w,logger:g})=>{let f,h;let d="To refresh this SSO session run aws sso login with the corresponding profile.";if(s)try{let e=await S({profile:w})();f={accessToken:e.token,expiresAt:new Date(e.expiration).toISOString()}}catch(e){throw new o.m(e.message,{tryNextLink:!1,logger:g})}else try{f=await (0,r.gH)(e)}catch(e){throw new o.m(`The SSO session associated with this profile is invalid. ${d}`,{tryNextLink:!1,logger:g})}if(new Date(f.expiresAt).getTime()-Date.now()<=0)throw new o.m(`The SSO session associated with this profile has expired. ${d}`,{tryNextLink:!1,logger:g});let{accessToken:u}=f,{SSOClient:p,GetRoleCredentialsCommand:m}=await t.e(523).then(t.bind(t,4523)),_=l||new p(Object.assign({},c??{},{region:c?.region??n}));try{h=await _.send(new m({accountId:i,roleName:a,accessToken:u}))}catch(e){throw new o.m(e,{tryNextLink:!1,logger:g})}let{roleCredentials:{accessKeyId:k,secretAccessKey:y,sessionToken:x,expiration:T,credentialScope:O}={}}=h;if(!k||!y||!x||!T)throw new o.m("SSO returns an invalid temporary credential.",{tryNextLink:!1,logger:g});return{accessKeyId:k,secretAccessKey:y,sessionToken:x,expiration:new Date(T),credentialScope:O}},_=(e,s)=>{let{sso_start_url:t,sso_account_id:r,sso_region:i,sso_role_name:n}=e;if(!t||!r||!i||!n)throw new o.m(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(e).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`,{tryNextLink:!1,logger:s});return e},k=(e={})=>async()=>{e.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");let{ssoStartUrl:s,ssoAccountId:t,ssoRegion:n,ssoRoleName:a,ssoSession:l}=e,{ssoClient:c}=e,w=(0,r.Jl)(e);if(s||t||n||a||l){if(s&&t&&n&&a)return m({ssoStartUrl:s,ssoSession:l,ssoAccountId:t,ssoRegion:n,ssoRoleName:a,ssoClient:c,clientConfig:e.clientConfig,profile:w});throw new o.m('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"',{tryNextLink:!1,logger:e.logger})}{let t=(await (0,r.MX)(e))[w];if(!t)throw new o.m(`Profile ${w} was not found.`,{logger:e.logger});if(!i(t))throw new o.m(`Profile ${w} is not configured with SSO credentials.`,{logger:e.logger});if(t?.sso_session){let i=(await (0,r.G)(e))[t.sso_session],a=` configurations in profile ${w} and sso-session ${t.sso_session}`;if(n&&n!==i.sso_region)throw new o.m("Conflicting SSO region"+a,{tryNextLink:!1,logger:e.logger});if(s&&s!==i.sso_start_url)throw new o.m("Conflicting SSO start_url"+a,{tryNextLink:!1,logger:e.logger});t.sso_region=i.sso_region,t.sso_start_url=i.sso_start_url}let{sso_start_url:a,sso_account_id:l,sso_region:g,sso_role_name:f,sso_session:h}=_(t,e.logger);return m({ssoStartUrl:a,ssoSession:h,ssoAccountId:l,ssoRegion:g,ssoRoleName:f,ssoClient:c,clientConfig:e.clientConfig,profile:w})}}}};