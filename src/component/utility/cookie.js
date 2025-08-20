exports.getCookie=(name)=> {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
    }
    return null;
  }
exports.setCookie=(name, value, day)=> {
    if (typeof document !== 'undefined') {
      let date = day ? day : 365;
      const maxAge = date * 24 * 60 * 60;
      const expires = new Date(Date.now() + maxAge * 1000);
      
      // Set cookie with SameSite=None and Secure (required for third-party iframes)
      document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=None; Secure`;
    }
  }
exports.removeCookie=(name)=> {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }