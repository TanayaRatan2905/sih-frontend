export const createPageUrl = (pageName) => {
  const pageUrls = {
    Home: '/',
    WipeInterface: '/wipe-interface',
    Certificates: '/certificates',
    VerifyCertificate: '/verify-certificate',
    Dashboard: '/dashboard',
  };
  return pageUrls[pageName] || '/';
};