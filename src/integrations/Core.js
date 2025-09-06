// This is a mock API integration file.
// In a real application, these functions would make actual network requests.

export const UploadFile = async ({ file }) => {
  console.log("Simulating file upload:", file.name);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ file_url: `https://mock-cdn.com/${file.name}` });
    }, 1500);
  });
};

export const ExtractDataFromUploadedFile = async ({ file_url, json_schema }) => {
  console.log("Simulating data extraction from URL:", file_url);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data based on the schema
      const mockOutput = {
        certificate_id: "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        organization: "Mock Corp",
        target_description: "HDD, 500GB",
        wipe_standard: "dod_3_pass",
        issue_date: new Date().toISOString().split('T')[0],
        verification_hash: "MOCK-HASH-" + Math.random().toString(36).substr(2, 9),
      };
      resolve({
        status: "success",
        output: mockOutput,
      });
    }, 2000);
  });
};

export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  console.log("Simulating LLM invocation with prompt:", prompt);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock health data
      const mockHealthData = {
        health_score: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
        bad_sectors: Math.floor(Math.random() * 50),
        temperature: Math.floor(Math.random() * (45 - 25 + 1)) + 25,
        read_errors: Math.floor(Math.random() * 20),
        write_errors: Math.floor(Math.random() * 10),
        recommendation: "Disk health is within acceptable parameters for wiping.",
      };
      resolve(mockHealthData);
    }, 1500);
  });
};