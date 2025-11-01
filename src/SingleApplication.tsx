import styles from "./SingleApplication.module.css";
import type { Application } from "./api/applications";
import { formatDate } from "./utils/dates";
import { formatCurrency } from "./utils/currency";

type SingleApplicationProps = {
  application: Application;
};

const SingleApplication = ({ application }: SingleApplicationProps) => {
  const headingId = `application-${application.id}-heading`;

  return (
    <article
      className={styles.SingleApplication}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className={styles.srOnly}>
        Application {application.id}: {application.company}
      </h2>
      <dl className={styles.cardContent}>
        <div className={`${styles.field} ${styles.fieldCompany}`}>
          <dt className={styles.fieldLabel}>Company</dt>
          <dd className={styles.fieldValue}>{application.company}</dd>
        </div>

        <div className={`${styles.field} ${styles.fieldName}`}>
          <dt className={styles.fieldLabel}>Name</dt>
          <dd className={styles.fieldValue}>
            {application.first_name} {application.last_name}
          </dd>
        </div>

        <div className={`${styles.field} ${styles.fieldEmail}`}>
          <dt className={styles.fieldLabel}>Email</dt>
          <dd className={styles.fieldValue}>
            <a
              href={`mailto:${application.email}`}
              className={`${styles.fieldValueEmail} ${styles.emailLink}`}
              aria-label={`Email ${application.first_name} ${application.last_name} at ${application.email}`}
            >
              {application.email}
            </a>
          </dd>
        </div>

        <div className={`${styles.field} ${styles.fieldAmount}`}>
          <dt className={styles.fieldLabel}>Loan amount</dt>
          <dd className={styles.fieldValue}>
            <span aria-label={`${formatCurrency(application.loan_amount)} British pounds`}>
              {formatCurrency(application.loan_amount)}
            </span>
          </dd>
        </div>

        <div className={`${styles.field} ${styles.fieldDate}`}>
          <dt className={styles.fieldLabel}>Application date</dt>
          <dd className={styles.fieldValue}>
            <time dateTime={application.date_created}>
              {formatDate(application.date_created)}
            </time>
          </dd>
        </div>

        <div className={`${styles.field} ${styles.fieldExpiry}`}>
          <dt className={styles.fieldLabel}>Expiry date</dt>
          <dd className={styles.fieldValue}>
            <time dateTime={application.expiry_date}>
              {formatDate(application.expiry_date)}
            </time>
          </dd>
        </div>
      </dl>
    </article>
  );
};

export default SingleApplication;
