export async function GET(){
  const base=process.env.CIRCLE_GATEWAY_API_BASE ?? 'https://gateway-api-testnet.circle.com';
  const response=await fetch(`${base}/gateway/v1/x402/supported`,{cache:'no-store'});
  const body=await response.json().catch(()=>({}));
  return Response.json(body,{status:response.status});
}
