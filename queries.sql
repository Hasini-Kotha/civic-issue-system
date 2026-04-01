-- ===============================
-- BASIC QUERIES
-- ===============================

-- 1. View all issues
SELECT * FROM issues;

-- 2. View all users
SELECT * FROM users;

-- 3. View all feedback
SELECT * FROM feedback;

-- 4. Show resolved issues
SELECT * FROM issues WHERE status = 'RESOLVED';

-- 5. Show high severity issues
SELECT * FROM issues WHERE severity = 'HIGH';

-- 6. Show issues under review
SELECT * FROM issues WHERE status = 'UNDER_REVIEW';


-- ===============================
-- SORTING & COUNT
-- ===============================

-- 7. Latest issues first
SELECT * FROM issues ORDER BY created_at DESC;

-- 8. Oldest issues first
SELECT * FROM issues ORDER BY created_at ASC;

-- 9. Count total issues
SELECT COUNT(*) FROM issues;

-- 10. Count resolved issues
SELECT COUNT(*) FROM issues WHERE status = 'RESOLVED';


-- ===============================
-- GROUP BY / ANALYTICS
-- ===============================

-- 11. Issues per category
SELECT category, COUNT(*) 
FROM issues 
GROUP BY category;

-- 12. Issues per severity
SELECT severity, COUNT(*) 
FROM issues 
GROUP BY severity;

-- 13. Issues per status
SELECT status, COUNT(*) 
FROM issues 
GROUP BY status;


-- ===============================
-- JOIN QUERIES
-- ===============================

-- 14. Join issues with feedback
SELECT i.id, i.description, f.rating, f.comment
FROM issues i
JOIN feedback f ON i.id = f.issue_id;

-- 15. Issues with rating > 4
SELECT i.description, f.rating
FROM issues i
JOIN feedback f ON i.id = f.issue_id
WHERE f.rating > 4;

-- 16. Count feedback per issue
SELECT issue_id, COUNT(*) 
FROM feedback 
GROUP BY issue_id;


-- ===============================
-- ADVANCED QUERIES
-- ===============================

-- 17. Average rating
SELECT AVG(rating) FROM feedback;

-- 18. Issues without feedback
SELECT * FROM issues
WHERE id NOT IN (SELECT issue_id FROM feedback);

-- 19. Duplicate issues
SELECT * FROM issues
WHERE duplicate_of IS NOT NULL;

-- 20. Top 5 recent issues
SELECT * FROM issues
ORDER BY created_at DESC
LIMIT 5;

-- 21. Most common category
SELECT category, COUNT(*) AS total
FROM issues
GROUP BY category
ORDER BY total DESC
LIMIT 1;

-- 22. Issues in location range
SELECT * FROM issues
WHERE latitude BETWEEN 10 AND 20
AND longitude BETWEEN 70 AND 80;

-- 23. Average resolution time
SELECT AVG(resolved_at - created_at) 
FROM issues
WHERE status = 'RESOLVED';

-- 24. Admin users
SELECT * FROM users
WHERE role = 'ADMIN';

-- 25. High severity unresolved issues
SELECT * FROM issues
WHERE severity = 'HIGH'
AND status != 'RESOLVED';
