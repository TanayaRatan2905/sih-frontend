// This is a mock data entity.
// In a real application, this would interact with a backend API.
const mockCertificates = [
  {
    id: "cert-1",
    certificate_id: "CERT-08152024A",
    session_id: "sess-1",
    organization: "SecureWipe Solutions",
    target_description: "Server HDD 1TB",
    wipe_standard: "dod_7_pass",
    verification_hash: "hash-xyz-123",
    created_date: new Date(2024, 7, 15).toISOString(),
    expiry_date: new Date(2025, 7, 15).toISOString(),
    is_verified: true,
    compliance_standards: ["DoD 5220.22-M", "NIST 800-88"],
  },
  {
    id: "cert-2",
    certificate_id: "CERT-08102024B",
    session_id: "sess-2",
    organization: "Global Tech Inc.",
    target_description: "Laptop SSD 512GB",
    wipe_standard: "gutmann_35_pass",
    verification_hash: "hash-abc-456",
    created_date: new Date(2024, 7, 10).toISOString(),
    expiry_date: new Date(2025, 7, 10).toISOString(),
    is_verified: true,
    compliance_standards: ["HIPAA", "GDPR"],
  },
];

export const Certificate = {
  list: async (sort = "") => {
    console.log("Fetching list of certificates with sort:", sort);
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...mockCertificates];
        if (sort === "-created_date") {
          sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        }
        resolve(sorted);
      }, 500);
    });
  },
  filter: async (query) => {
    console.log("Filtering certificates with query:", query);
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockCertificates.filter((cert) => {
          for (const key in query) {
            if (cert[key] !== query[key]) {
              return false;
            }
          }
          return true;
        });
        resolve(results);
      }, 500);
    });
  },
  create: async (data) => {
    console.log("Creating new certificate:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCert = {
          ...data,
          id: `cert-${mockCertificates.length + 1}`,
          created_date: new Date().toISOString(),
          is_verified: true,
        };
        mockCertificates.push(newCert);
        resolve(newCert);
      }, 500);
    });
  },
};