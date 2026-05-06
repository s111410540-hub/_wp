// functions/utils.js

// Hash password using Web Crypto API (SHA-256)
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simple base64url encode/decode
function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Create JWT
export async function createJWT(payload, secret) {
  const encoder = new TextEncoder();
  
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64urlEncode(encoder.encode(JSON.stringify(payload)));
  
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign));
  const encodedSignature = base64urlEncode(signature);
  
  return `${dataToSign}.${encodedSignature}`;
}

// Verify JWT
export async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    // Decode base64url signature back to Uint8Array
    const signatureStr = atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/'));
    const signatureBuffer = new Uint8Array(signatureStr.length);
    for (let i = 0; i < signatureStr.length; i++) {
      signatureBuffer[i] = signatureStr.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBuffer, encoder.encode(dataToVerify));
    
    if (!isValid) return null;
    
    const payloadStr = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadStr);
  } catch (err) {
    return null;
  }
}

export function getBadge(totalVotes) {
  if (totalVotes >= 100000) return { title: '榮耀大神',     level: 10 };
  if (totalVotes >= 50000)  return { title: '全服第一',     level: 9  };
  if (totalVotes >= 20000)  return { title: '職業選手',     level: 8  };
  if (totalVotes >= 10000)  return { title: '天榜高手',     level: 7  };
  if (totalVotes >= 5000)   return { title: '神之領域居民', level: 6  };
  if (totalVotes >= 1000)   return { title: '菁英冒險者',   level: 5  };
  if (totalVotes >= 500)    return { title: '熟練玩家',     level: 4  };
  if (totalVotes >= 200)    return { title: '進階玩家',     level: 3  };
  if (totalVotes >= 50)     return { title: '見習冒險者',   level: 2  };
  return                           { title: '新手玩家',     level: 1  };
}
