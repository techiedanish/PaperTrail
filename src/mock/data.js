// Mock data shaped like the planned API responses (see docs/API_SPEC.md).
// Kenshi has no backend — this file stands in for the database.

export const subjects = [
  {
    id: 'cs301', code: 'CS301', name: 'Database Management Systems', semester: 5,
    units: [
      { id: 'u1', title: 'Unit 1 — Relational Model', topics: ['ER modelling', 'Keys & constraints', 'Relational algebra'] },
      { id: 'u2', title: 'Unit 2 — Normalisation', topics: ['Functional dependency', '1NF–3NF', 'BCNF'] },
      { id: 'u3', title: 'Unit 3 — Transactions', topics: ['ACID properties', 'Concurrency control', 'Deadlocks'] },
    ],
  },
  {
    id: 'cs302', code: 'CS302', name: 'Operating Systems', semester: 5,
    units: [
      { id: 'u1', title: 'Unit 1 — Process Management', topics: ['Scheduling', 'Context switching', 'Threads'] },
      { id: 'u2', title: 'Unit 2 — Memory Management', topics: ['Paging', 'Segmentation', 'Virtual memory'] },
      { id: 'u3', title: 'Unit 3 — File Systems', topics: ['Allocation methods', 'Directory structure'] },
    ],
  },
  {
    id: 'cs303', code: 'CS303', name: 'Design & Analysis of Algorithms', semester: 5,
    units: [
      { id: 'u1', title: 'Unit 1 — Complexity', topics: ['Asymptotic notation', 'Recurrence relations'] },
      { id: 'u2', title: 'Unit 2 — Greedy & DP', topics: ['Greedy choice', 'Dynamic programming', 'Knapsack'] },
      { id: 'u3', title: 'Unit 3 — Graph Algorithms', topics: ['BFS/DFS', 'Shortest path', 'MST'] },
    ],
  },
]

export const papers = [
  { id: 'p1', subjectId: 'cs301', examType: 'mid', year: 2024, status: 'approved', verified: true, questionCount: 12, uploadedBy: 'Admin' },
  { id: 'p2', subjectId: 'cs301', examType: 'end', year: 2023, status: 'approved', verified: true, questionCount: 18, uploadedBy: 'Priya S.' },
  { id: 'p3', subjectId: 'cs302', examType: 'mid', year: 2024, status: 'approved', verified: true, questionCount: 10, uploadedBy: 'Admin' },
  { id: 'p4', subjectId: 'cs302', examType: 'end', year: 2022, status: 'approved', verified: false, questionCount: 16, uploadedBy: 'Rohan D.' },
  { id: 'p5', subjectId: 'cs303', examType: 'mid', year: 2023, status: 'approved', verified: true, questionCount: 9, uploadedBy: 'Admin' },
  { id: 'p6', subjectId: 'cs303', examType: 'end', year: 2024, status: 'pending', verified: false, questionCount: 0, uploadedBy: 'You' },
  { id: 'p7', subjectId: 'cs301', examType: 'mid', year: 2023, status: 'rejected', verified: false, questionCount: 0, uploadedBy: 'You', rejectReason: 'Scan is unreadable past question 6 — please re-upload a clearer copy.' },
]

export const verifiedQuestions = {
  cs301: [
    { id: 'q1', text: 'Explain the difference between 2NF and 3NF with an example schema.', marks: 5, topic: 'Normalisation' },
    { id: 'q2', text: 'What is a candidate key? How does it differ from a primary key?', marks: 3, topic: 'Keys & constraints' },
    { id: 'q3', text: 'Describe the ACID properties of a transaction with one example each.', marks: 8, topic: 'ACID properties' },
    { id: 'q4', text: 'Convert the given ER diagram into a set of relational schemas.', marks: 10, topic: 'ER modelling' },
    { id: 'q5', text: 'What is a deadlock? Explain one method used to prevent it.', marks: 6, topic: 'Deadlocks' },
  ],
  cs302: [
    { id: 'q6', text: 'Compare First-Come-First-Served and Shortest-Job-First scheduling with an example.', marks: 8, topic: 'Scheduling' },
    { id: 'q7', text: 'Explain paging with the help of a page table diagram.', marks: 6, topic: 'Paging' },
    { id: 'q8', text: 'What is thrashing? How can virtual memory thrashing be reduced?', marks: 5, topic: 'Virtual memory' },
  ],
  cs303: [
    { id: 'q9', text: 'State the 0/1 Knapsack problem and solve it using dynamic programming for a given instance.', marks: 10, topic: 'Dynamic programming' },
    { id: 'q10', text: 'Derive the time complexity of the merge sort algorithm using the recurrence relation.', marks: 6, topic: 'Recurrence relations' },
    { id: 'q11', text: "Explain Prim's algorithm for finding a Minimum Spanning Tree with an example.", marks: 8, topic: 'MST' },
  ],
}

export const myUploads = [
  { id: 'p6', subjectId: 'cs303', examType: 'end', year: 2024, status: 'pending' },
  { id: 'p7', subjectId: 'cs301', examType: 'mid', year: 2023, status: 'rejected', rejectReason: 'Scan is unreadable past question 6 — please re-upload a clearer copy.' },
  { id: 'p2', subjectId: 'cs301', examType: 'end', year: 2023, status: 'approved' },
]

export const myGeneratedSets = [
  {
    id: 'g1', subjectId: 'cs301', unitId: 'u2', createdAt: '2026-09-29',
    questions: [
      { id: 'gq1', text: 'A relation R(A,B,C,D) has the FD set {A→B, B→C}. Identify the highest normal form it satisfies and justify your answer.', marks: 6, topic: 'Normalisation' },
      { id: 'gq2', text: 'Explain why BCNF can sometimes cause loss of a functional dependency during decomposition.', marks: 5, topic: 'BCNF' },
    ],
  },
]

export const adminQueue = papers.filter((p) => p.status === 'pending' || p.status === 'rejected').map((p) => ({
  ...p, uploadedBy: p.id === 'p6' ? 'Ananya R.' : 'Suresh K.',
}))

export function subjectById(id) {
  return subjects.find((s) => s.id === id)
}
