# Contributing to Tiling Estimator

First off, thank you for considering contributing to Tiling Estimator! It's people like you that make this tool better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples** 
* **Describe the behavior you observed and what you expected**
* **Include screenshots** if possible
* **Browser and OS information**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List any similar features in other applications** if applicable

### Pull Requests

* Fill in the required template
* Follow the JavaScript/React style guide
* Include comments in your code where necessary
* Update documentation as needed
* End all files with a newline
* Avoid platform-dependent code

## Development Process

### Setup Development Environment

1. Fork the repo
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/tiling-estimator.git
   cd tiling-estimator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Make your changes and test:
   ```bash
   npm run dev
   ```

6. Run build to ensure no errors:
   ```bash
   npm run build
   ```

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Examples:
```
Add tile trim calculation feature
Fix grout calculation for large joints
Update README with new features
```

### Code Style

* Use 2 spaces for indentation
* Use meaningful variable names
* Add comments for complex logic
* Keep functions small and focused
* Follow React best practices

### Testing Checklist

Before submitting a PR, ensure:

- [ ] Code builds without errors (`npm run build`)
- [ ] Application runs in development (`npm run dev`)
- [ ] All features work as expected
- [ ] No console errors
- [ ] Responsive design maintained
- [ ] All themes work correctly
- [ ] Documentation updated

## Project Structure

```
tiling-estimator/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── docs/               # Documentation files
├── .github/            # GitHub-specific files
└── package.json        # Dependencies and scripts
```

## Feature Development Guidelines

### Adding New Features

1. **Discuss First**: Open an issue to discuss major features before coding
2. **Keep it Simple**: Follow the existing design patterns
3. **Test Thoroughly**: Test on multiple browsers and screen sizes
4. **Document**: Update README and relevant docs
5. **No Breaking Changes**: Maintain backward compatibility

### Calculator Features

When adding calculation features:
- Follow existing material rate patterns
- Use industry-standard formulas
- Include tooltips/help text
- Make it theme-aware
- Test with edge cases (0 values, decimals, large numbers)

### UI Components

When adding UI components:
- Match existing design system
- Support all 4 themes (Modern Dark, Classic Blue, Minimal Light, Sunset)
- Make it responsive (mobile, tablet, desktop)
- Use consistent spacing and styling
- Add proper accessibility (ARIA labels, keyboard navigation)

### Professional Mode Features

Features for Professional Mode should:
- Be clearly separated from free features
- Include proper state management
- Work with export functions
- Support business branding

## Documentation

Good documentation includes:

* **Code Comments**: Explain "why" not "what"
* **README Updates**: New features need documentation
* **JSDoc**: For functions with complex parameters
* **Examples**: Show how to use new features

## Questions?

Feel free to open an issue with the question label or reach out to the maintainers.

## Recognition

Contributors will be recognized in the README. Thank you for making Tiling Estimator better!
