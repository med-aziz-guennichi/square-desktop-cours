# Security Policy

## Reporting Vulnerabilities

**Please do not report security vulnerabilities through public GitHub issues.** Instead, contact us at:
- Email: medazizguennichi@gmail.com
- Security Team: https://github.com/med-aziz-guennichi

**We will:**
- Acknowledge receipt within 24 hours
- Investigate and provide updates weekly
- Publicly disclose resolved vulnerabilities through GitHub advisories

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Security Measures

### Application Security
- Content Protection: Window content protection for sensitive operations
- Secure Updates: Cryptographic signature verification for updates
- Data Protection: AES-256 encryption for local storage
- Input Validation: Strict file type/size restrictions for uploads

### Infrastructure Security
- Static Code Analysis: SonarQube integration
- Dependency Scanning: Dependabot integration (see `bun.lock`)
- CI/CD Security: Required code reviews, signed commits

## Best Practices

### For Contributors
- Follow [Secure Coding Guidelines](./docs/SECURE_CODING.md)
- Use `npm audit` and `cargo audit` regularly
- Never hardcode secrets (use Tauri's config encryption)
- Validate all user inputs (see `upload-documents.tsx` examples)

### For Users
- Keep application updated (automatic updates via `updater.ts`)
- Report suspicious behavior immediately
- Use strong passwords (minimum 12 characters)

## Incident Response
We follow a 5-stage process:
1. Identification
2. Containment
3. Eradication
4. Recovery
5. Post-Incident Review

---

*Last updated: 25/04/2025*  
*Policy version: 2.1.0*
