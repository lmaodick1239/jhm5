# Applied Learning Grade Restrictions

**Date Implemented:** October 4, 2025  
**Feature:** Grade restrictions for Applied Learning subjects

---

## 📋 Overview

Applied Learning subjects in HKDSE have a **different grading system** than Category A subjects. This feature automatically restricts available grades when a user selects an Applied Learning subject.

## 🎓 Applied Learning Grading System

According to official HKEAA guidelines, Applied Learning subjects are reported with the following grades:

- **4** - Attained with Distinction (II)
- **3** - Attained with Distinction (I)
- **2** - Attained
- **U** - Unclassified

**Note:** Applied Learning does NOT use grades 5**, 5*, 5, or 1.

## ✅ Implementation Details

### Key Changes in `SubjectInput.tsx`:

1. **New Constant:**
   ```typescript
   const APPLIED_LEARNING_GRADES: Grade[] = ['4', '3', '2', 'U'];
   ```

2. **Helper Functions:**
   ```typescript
   // Check if subject is Applied Learning
   const isAppliedLearning = (subjectName: string): boolean => {
     return CATEGORY_B_SUBJECTS.includes(subjectName);
   };

   // Get available grades based on subject type
   const getAvailableGrades = (subjectName: string): Grade[] => {
     return isAppliedLearning(subjectName) ? APPLIED_LEARNING_GRADES : GRADES;
   };
   ```

3. **Smart Subject Change Handler:**
   ```typescript
   const handleSubjectChange = (electiveNum: 1 | 2 | 3, newSubject: string) => {
     // Automatically resets grade if current grade is not valid for new subject
     // Defaults to grade '3' when switching to/from Applied Learning
   };
   ```

4. **Dynamic Grade Dropdowns:**
   - Each elective grade dropdown now uses `getAvailableGrades(subjectName)`
   - Shows only valid grades (U, 2, 3, 4) when Applied Learning is selected
   - Shows all grades (5**, 5*, 5, 4, 3, 2, 1, U) for other subjects

5. **Visual Feedback:**
   - Description text appears under grade dropdown: "Applied Learning: U, 2, 3, 4 only"
   - Helps users understand why grade options are limited

## 🎯 User Experience

### Scenario 1: User selects Applied Learning
1. User changes elective subject to "Applied Learning (Various courses)"
2. Grade dropdown **automatically updates** to show only: 4, 3, 2, U
3. If current grade (e.g., 5**) is invalid, it **auto-resets to 3**
4. Helper text appears: "Applied Learning: U, 2, 3, 4 only"

### Scenario 2: User switches from Applied Learning to Category A
1. User changes from "Applied Learning" to "Biology"
2. Grade dropdown **automatically updates** to show all grades: 5**, 5*, 5, 4, 3, 2, 1, U
3. Current grade is preserved if still valid
4. Helper text disappears

### Scenario 3: User switches between Category A subjects
1. Grade dropdown remains unchanged (all grades available)
2. Current grade is preserved
3. No auto-reset needed

## 🔄 Affected Components

- **Elective 1:** ✅ Grade restrictions applied
- **Elective 2:** ✅ Grade restrictions applied
- **Elective 3:** ✅ Grade restrictions applied
- **Core Subjects:** ❌ Not affected (Chinese, English, Math always use full grading)

## 📊 Grade Mapping

### Applied Learning Grades → Points:

| Grade | Points | Description |
|-------|--------|-------------|
| 4 | 4 | Attained with Distinction (II) |
| 3 | 3 | Attained with Distinction (I) |
| 2 | 2 | Attained |
| U | 0 | Unclassified |

### Category A Grades → Points:

| Grade | Points | Description |
|-------|--------|-------------|
| 5** | 7 | Level 5** |
| 5* | 6 | Level 5* |
| 5 | 5 | Level 5 |
| 4 | 4 | Level 4 |
| 3 | 3 | Level 3 |
| 2 | 2 | Level 2 |
| 1 | 1 | Level 1 |
| U | 0 | Unclassified |

## 🧪 Testing Checklist

- [x] Applied Learning shows only U, 2, 3, 4 grades
- [x] Category A subjects show all grades (5** to U)
- [x] Grade auto-resets when switching to Applied Learning with invalid grade
- [x] Grade preserved when switching between Category A subjects
- [x] Helper text appears for Applied Learning
- [x] All three electives work independently
- [x] Calculate button still works correctly
- [x] No TypeScript errors

## 📚 References

**Official HKEAA Documentation:**
- Applied Learning subjects are reported as "Attained", "Attained with Distinction (I)", "Attained with Distinction (II)", or "Not Attained"
- For JUPAS applications, Applied Learning is converted to level equivalents (2, 3, 4)
- Applied Learning does not use the standard DSE 1-5** grading scale

**Source:** HKEAA Subject Information - Category B (Applied Learning)

---

## 💡 Future Enhancements (Optional)

1. **Grade Labels:** Show descriptive labels instead of just numbers
   - 4 → "Attained with Distinction (II)"
   - 3 → "Attained with Distinction (I)"
   - 2 → "Attained"
   - U → "Unclassified"

2. **Visual Distinction:** Use different color scheme for Applied Learning dropdowns

3. **Info Tooltip:** Add tooltip explaining Applied Learning grading system

4. **Category C Handling:** If Category C languages have special grading, apply similar logic

---

**Status:** ✅ **COMPLETE** - Applied Learning grade restrictions fully implemented and working.
