// This is a mock data entity.
// In a real application, this would interact with a backend API.
const mockSessions = [
  {
    id: "sess-1",
    session_name: "Server Wipe Q3",
    wipe_type: "full_disk",
    target_path: "/dev/sda",
    platform: "linux",
    status: "completed",
    health_score: 92,
    health_details: { bad_sectors: 0, temperature: 35, read_errors: 0, write_errors: 0 },
    wipe_method: "dod_7_pass",
    size_gb: 1024,
    duration_minutes: 180,
    certificate_id: "CERT-08152024A",
    created_date: new Date(2024, 7, 15).toISOString(),
  },
  {
    id: "sess-2",
    session_name: "Laptop Disposal",
    wipe_type: "full_disk",
    target_path: "C:\\",
    platform: "windows",
    status: "completed",
    health_score: 85,
    health_details: { bad_sectors: 5, temperature: 40, read_errors: 2, write_errors: 1 },
    wipe_method: "gutmann_35_pass",
    size_gb: 512,
    duration_minutes: 240,
    certificate_id: "CERT-08102024B",
    created_date: new Date(2024, 7, 10).toISOString(),
  },
  {
    id: "sess-3",
    session_name: "Test Wipe 1",
    wipe_type: "folder",
    target_path: "/users/documents",
    platform: "mac",
    status: "wiping",
    health_score: 95,
    health_details: { bad_sectors: 0, temperature: 32, read_errors: 0, write_errors: 0 },
    wipe_method: "random_single",
    created_date: new Date().toISOString(),
  },
  {
    id: "sess-4",
    session_name: "Pending wipe",
    wipe_type: "full_disk",
    target_path: "/dev/sdb",
    platform: "linux",
    status: "pending",
    created_date: new Date().toISOString(),
  },
];

export const WipeSession = {
  list: async (sort = "") => {
    console.log("Fetching list of sessions with sort:", sort);
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...mockSessions];
        if (sort === "-created_date") {
          sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        }
        resolve(sorted);
      }, 500);
    });
  },
  filter: async (query) => {
    console.log("Filtering sessions with query:", query);
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockSessions.filter((session) => {
          for (const key in query) {
            if (session[key] !== query[key]) {
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
    console.log("Creating new session:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSession = {
          ...data,
          id: `sess-${mockSessions.length + 1}`,
          created_date: new Date().toISOString(),
        };
        mockSessions.push(newSession);
        resolve(newSession);
      }, 500);
    });
  },
  update: async (id, data) => {
    console.log(`Updating session ${id} with data:`, data);
    return new Promise((resolve, reject) => {
      const session = mockSessions.find(s => s.id === id);
      if (session) {
        Object.assign(session, data);
        resolve(session);
      } else {
        reject(new Error("Session not found"));
      }
    });
  },
};