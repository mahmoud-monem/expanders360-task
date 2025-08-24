// MongoDB initialization script
db = db.getSiblingDB("expanders360");

// Create collections
db.createCollection("researchdocuments");

// Create indexes for better performance
db.researchdocuments.createIndex({ projectId: 1 });
db.researchdocuments.createIndex({ tags: 1 });
db.researchdocuments.createIndex({ title: "text", content: "text" });

print("MongoDB initialized for expanders360");
