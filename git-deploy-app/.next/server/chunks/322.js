"use strict";exports.id=322,exports.ids=[322],exports.modules={1322:(e,t,a)=>{a.d(t,{ENV_CMDS_FULL_URI:()=>g,ENV_CMDS_RELATIVE_URI:()=>w,fromContainerMetadata:()=>E,fromInstanceMetadata:()=>K,getInstanceMetadataEndpoint:()=>N,httpRequest:()=>d});var r,n,o=a(3145),i=a(7310),s=a(13),c=a(4300),l=a(3685);function d(e){return new Promise((t,a)=>{let r=(0,l.request)({method:"GET",...e,hostname:e.hostname?.replace(/^\[(.+)\]$/,"$1")});r.on("error",e=>{a(Object.assign(new s.k("Unable to connect to instance metadata service"),e)),r.destroy()}),r.on("timeout",()=>{a(new s.k("TimeoutError from instance metadata service")),r.destroy()}),r.on("response",e=>{let{statusCode:n=400}=e;(n<200||300<=n)&&(a(Object.assign(new s.k("Error response received from instance metadata service"),{statusCode:n})),r.destroy());let o=[];e.on("data",e=>{o.push(e)}),e.on("end",()=>{t(c.Buffer.concat(o)),r.destroy()})}),r.end()})}let p=e=>!!e&&"object"==typeof e&&"string"==typeof e.AccessKeyId&&"string"==typeof e.SecretAccessKey&&"string"==typeof e.Token&&"string"==typeof e.Expiration,u=e=>({accessKeyId:e.AccessKeyId,secretAccessKey:e.SecretAccessKey,sessionToken:e.Token,expiration:new Date(e.Expiration)}),m=1e3,h=0,f=({maxRetries:e=h,timeout:t=m})=>({maxRetries:e,timeout:t}),v=(e,t)=>{let a=e();for(let r=0;r<t;r++)a=a.catch(e);return a},g="AWS_CONTAINER_CREDENTIALS_FULL_URI",w="AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",y="AWS_CONTAINER_AUTHORIZATION_TOKEN",E=(e={})=>{let{timeout:t,maxRetries:a}=f(e);return()=>v(async()=>{let a=await S({logger:e.logger}),r=JSON.parse(await I(t,a));if(!p(r))throw new o.m("Invalid response received from instance metadata service.",{logger:e.logger});return u(r)},a)},I=async(e,t)=>(process.env[y]&&(t.headers={...t.headers,Authorization:process.env[y]}),(await d({...t,timeout:e})).toString()),_={localhost:!0,"127.0.0.1":!0},A={"http:":!0,"https:":!0},S=async({logger:e})=>{if(process.env[w])return{hostname:"169.254.170.2",path:process.env[w]};if(process.env[g]){let t=(0,i.parse)(process.env[g]);if(!t.hostname||!(t.hostname in _))throw new o.m(`${t.hostname} is not a valid container metadata service hostname`,{tryNextLink:!1,logger:e});if(!t.protocol||!(t.protocol in A))throw new o.m(`${t.protocol} is not a valid container metadata service protocol`,{tryNextLink:!1,logger:e});return{...t,port:t.port?parseInt(t.port,10):void 0}}throw new o.m(`The container metadata credential provider cannot be used unless the ${w} or ${g} environment variable is set`,{tryNextLink:!1,logger:e})};var b=a(5960);class T extends o.m{constructor(e,t=!0){super(e,t),this.tryNextLink=t,this.name="InstanceMetadataV1FallbackError",Object.setPrototypeOf(this,T.prototype)}}var D=a(386);!function(e){e.IPv4="http://169.254.169.254",e.IPv6="http://[fd00:ec2::254]"}(r||(r={}));let k={environmentVariableSelector:e=>e.AWS_EC2_METADATA_SERVICE_ENDPOINT,configFileSelector:e=>e.ec2_metadata_service_endpoint,default:void 0};!function(e){e.IPv4="IPv4",e.IPv6="IPv6"}(n||(n={}));let M={environmentVariableSelector:e=>e.AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE,configFileSelector:e=>e.ec2_metadata_service_endpoint_mode,default:n.IPv4},N=async()=>(0,D.e)(await x()||await C()),x=async()=>(0,b.M)(k)(),C=async()=>{let e=await (0,b.M)(M)();switch(e){case n.IPv4:return r.IPv4;case n.IPv6:return r.IPv6;default:throw Error(`Unsupported endpoint mode: ${e}. Select from ${Object.values(n)}`)}},O=(e,t)=>{let a=new Date(Date.now()+1e3*(300+Math.floor(300*Math.random())));t.warn(`Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(a)}.
For more information, please visit: https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html`);let r=e.originalExpiration??e.expiration;return{...e,...r?{originalExpiration:r}:{},expiration:a}},P=(e,t={})=>{let a;let r=t?.logger||console;return async()=>{let t;try{(t=await e()).expiration&&t.expiration.getTime()<Date.now()&&(t=O(t,r))}catch(e){if(a)r.warn("Credential renew failed: ",e),t=O(a,r);else throw e}return a=t,t}},R="/latest/meta-data/iam/security-credentials/",V="AWS_EC2_METADATA_V1_DISABLED",L="ec2_metadata_v1_disabled",$="x-aws-ec2-metadata-token",K=(e={})=>P(U(e),{logger:e.logger}),U=(e={})=>{let t=!1,{logger:a,profile:r}=e,{timeout:n,maxRetries:i}=f(e),s=async(a,n)=>{if(t||n.headers?.[$]==null){let t=!1,a=!1,n=await (0,b.M)({environmentVariableSelector:t=>{let r=t[V];if(a=!!r&&"false"!==r,void 0===r)throw new o.m(`${V} not set in env, checking config file next.`,{logger:e.logger});return a},configFileSelector:e=>{let a=e[L];return t=!!a&&"false"!==a},default:!1},{profile:r})();if(e.ec2MetadataV1Disabled||n){let r=[];throw e.ec2MetadataV1Disabled&&r.push("credential provider initialization (runtime option ec2MetadataV1Disabled)"),t&&r.push(`config file profile (${L})`),a&&r.push(`process environment variable (${V})`),new T(`AWS EC2 Metadata v1 fallback has been blocked by AWS SDK configuration in the following: [${r.join(", ")}].`)}}let i=(await v(async()=>{let e;try{e=await j(n)}catch(e){throw 401===e.statusCode&&(t=!1),e}return e},a)).trim();return v(async()=>{let a;try{a=await F(i,n,e)}catch(e){throw 401===e.statusCode&&(t=!1),e}return a},a)};return async()=>{let e=await N();if(t)return a?.debug("AWS SDK Instance Metadata","using v1 fallback (no token fetch)"),s(i,{...e,timeout:n});{let r;try{r=(await W({...e,timeout:n})).toString()}catch(r){if(r?.statusCode===400)throw Object.assign(r,{message:"EC2 Metadata token request returned error"});return("TimeoutError"===r.message||[403,404,405].includes(r.statusCode))&&(t=!0),a?.debug("AWS SDK Instance Metadata","using v1 fallback (initial)"),s(i,{...e,timeout:n})}return s(i,{...e,headers:{[$]:r},timeout:n})}}},W=async e=>d({...e,path:"/latest/api/token",method:"PUT",headers:{"x-aws-ec2-metadata-token-ttl-seconds":"21600"}}),j=async e=>(await d({...e,path:R})).toString(),F=async(e,t,a)=>{let r=JSON.parse((await d({...t,path:R+e})).toString());if(!p(r))throw new o.m("Invalid response received from instance metadata service.",{logger:a.logger});return u(r)}}};