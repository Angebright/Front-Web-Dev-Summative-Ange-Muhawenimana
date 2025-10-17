#  Student Finance Tracker

A **comprehensive, student-friendly expense management application** built using **vanilla HTML, CSS, and JavaScript**.  
This project demonstrates modern web development techniques including **semantic HTML**, **responsive design**, **advanced regex validation**, and **full accessibility support**.

---

## About the Project

**Student Finance Tracker** is a personal finance web app designed specifically for students.  
It helps users **track expenses**, **manage budgets**, and **analyze spending habits** across multiple categories — all from a simple, responsive dashboard.

---

##  Features

### Core Functionality

- **Transaction Management:** Add, edit, delete, and view financial transactions  
- **Multi-Currency Support:** Manual currency conversion between USD, EUR, and GBP  
- **Advanced Search:** Regex-powered search with pattern highlighting  
- **Smart Sorting:** Sort transactions by date, description, or amount with clear visual indicators  
- **Category Filtering:** Filter by customizable categories  
- **Budget Tracking:** Set and monitor monthly spending limits with live updates  
- **Visual Statistics Dashboard:**
  - Total transaction count  
  - Total amount spent  
  - Top spending category  
  - Last 7 days’ spending  
  - Category breakdown chart  
- **Data Persistence:** Automatic save via `localStorage`  
- **Import/Export Data:** JSON backup and restore functionality  
- **Responsive Design:** Mobile-first layout with multiple breakpoints  

---

##  Accessibility Highlights

Accessibility is a top priority. The app was designed to be **keyboard- and screen reader-friendly**, ensuring usability for everyone.

- Semantic HTML5 landmarks (`header`, `main`, `nav`, etc.)
- Proper heading hierarchy (`h1–h4`)
- Skip-to-content link
- Fully labeled form inputs
- Live regions and ARIA roles for dynamic updates
- Visible focus indicators and color contrast (WCAG AA compliant)
- Full keyboard navigation support

---

##  Regex Validation Library

The app uses **Regular Expressions (Regex)** for form validation and intelligent search.  

###  Core Validation Patterns

| Validation | Regex Pattern | Purpose |
|-------------|---------------|----------|
| **Description** | `/^\S(?:.*\S)?$/` | Ensures no leading/trailing spaces |
| **Amount** | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | Positive numbers, up to 2 decimals |
| **Date** | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | Valid `YYYY-MM-DD` format |
| **Category** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, spaces, and hyphens only |

### Advanced Patterns

| Pattern Name | Regex | Use Case |
|---------------|--------|----------|
| Duplicate Word Detection | `/\b(\w+)\s+\1\b/i` | Detects consecutive duplicate words |
| Cents Pattern | `/\.\d{2}\b/` | Finds transactions with cents |
| Beverage Search | `/(coffee|tea|juice)/i` | Filters beverage-related expenses |

---

##  File Structure



```
project/
├── index.html              # Dashboard page
├── about.html              # About/contact page
├── records.html            # View/manage transactions
├── add-edit.html           # Add/edit transaction form
├── settings.html           # App settings and data management
├── tests.html              # Validation tests page
├── seed.json               # Sample data (15+ records)
├── styles/
│   ├── main.css           # Core styles
│   └── responsive.css     # Media queries
├── scripts/
│   ├── storage.js         # localStorage operations
│   ├── state.js           # State management
│   ├── validators.js      # Regex validation functions
│   ├── search.js          # Regex search & highlight
│   ├── ui.js              # UI utilities
│   ├── dashboard.js       # Dashboard page logic
│   ├── add-edit.js        # Form page logic
│   ├── records.js         # Records page logic
│   └── settings.js        # Settings page logic
└── README.md              # This file
```

## Keyboard Navigation Map

### Global Navigation
- `Tab` - Move forward through interactive elements
- `Shift + Tab` - Move backward through interactive elements
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals

### Records Page
- `Tab` to search input → Enter regex pattern
- `Tab` to sort buttons → `Enter` to toggle sort direction
- `Tab` through table rows → `Enter` on Edit/Delete buttons
- `Escape` to cancel delete confirmation

### Form Page
- `Tab` through form fields
- `Enter` to submit form
- All validation errors announced to screen readers

### Settings Page
- `Tab` to navigate settings sections
- `Enter` to activate import/export actions
- Confirmation dialogs keyboard accessible

## Accessibility Notes

### ARIA Implementation

- **Live Regions**:
  - Budget cap status uses `aria-live="polite"` (under budget) and `aria-live="assertive"` (over budget)
  - Form validation errors use `role="alert"`
  - Search status updates use `role="status"`

- **Form Labels**: All inputs properly associated with labels using `for`/`id` relationship

- **Required Fields**: Marked with `aria-required="true"` and visual asterisk

- **Dynamic Content**: Sort button states communicated via `aria-pressed`

- **Modal Dialogs**: Use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`

### Color Contrast

- Text: #0f172a on #ffffff (16.38:1)
- Primary buttons: White text on #2563eb (8.59:1)
- Error messages: #991b1b on #fee2e2 (7.2:1)
- All ratios exceed WCAG AA requirements (4.5:1 for normal text)

### Focus Management

- Visible 2px blue focus outlines on all interactive elements
- Focus trap in modals
- Logical tab order throughout application
- Skip-to-content link for keyboard users

## Running Tests

1. Open `tests.html` in a browser
2. All validation tests run automatically on page load
3. View results showing pass/fail for each test case
4. Tests cover:
   - Description validation (leading/trailing spaces, double spaces)
   - Amount validation (positive numbers, decimals)
   - Date validation (format, valid dates)
   - Category validation (allowed characters)
   - Regex compiler (valid/invalid patterns)

## Setup Instructions

### Local Development

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd student-finance-tracker
   ```

2. Open `index.html` in a web browser (no build process required)

### Loading Seed Data

1. Navigate to Settings page
2. Click "Import Data"
3. Select `seed.json` file
4. Click "Import JSON"
5. Data will be loaded and page will refresh

### GitHub Pages Deployment

1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select branch (usually `main`) and root folder
4. Save and wait for deployment
5. Access at: `https://[username].github.io/[repo-name]`

## Technology Stack

- **HTML5**: Semantic markup with ARIA attributes
- **CSS3**: Flexbox, Grid, CSS Variables, Media Queries
- **JavaScript ES6+**: Modules, Arrow Functions, Template Literals
- **localStorage**: Client-side data persistence
- **Regular Expressions**: Input validation and search

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Milestones Completed

- ✓ M1: Spec & Wireframes (semantic structure, data model, accessibility plan)
- ✓ M2: Semantic HTML & Base CSS (responsive, mobile-first)
- ✓ M3: Forms & Regex Validation (4+ rules, advanced patterns, tests)
- ✓ M4: Render + Sort + Regex Search (safe compiler, highlighting)
- ✓ M5: Stats + Cap/Targets (dashboard metrics, ARIA live)
- ✓ M6: Persistence + Import/Export (localStorage, JSON validation)
- ✓ M7: Polish & A11y Audit (keyboard navigation, animations)

## Development Notes

### Code Organization

- **Modular JavaScript**: Each module has single responsibility
- **Separation of Concerns**: State, UI, validation, storage are separate
- **No Frameworks**: Pure vanilla JavaScript (no React, Bootstrap, etc.)
- **ES6 Modules**: Import/export for clean dependencies

### Validation Strategy

- Real-time validation on blur
- Clear error messages with ARIA announcements
- Prevents invalid data entry
- Edge cases handled (duplicate words, future dates, etc.)

### Security Considerations

- Input sanitization (HTML escaping)
- Safe regex compilation with try/catch
- No eval() or innerHTML with user data
- localStorage data validation on import

## Contact

- **Developer**: Ange muhawenimana
- **Email**: email@alustudent.com
- **GitHub**: [Your GitHub Profile]

## License

This project is created for educational purposes as part of a web development course.


