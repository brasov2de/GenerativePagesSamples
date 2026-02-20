import React from "react";
import { makeStyles } from '@fluentui/react-components';
const useStyles = makeStyles({
  diagramContainer: {
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '16px',
    borderRadius: '4px',
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  mermaidSvg: {
    display: 'flex',
    justifyContent: 'center',
    '& svg': {
      maxWidth: '100%',
      height: 'auto',
    },
  },
});

 

const GeneratedComponent: React.FC = () => {
const styles = useStyles();
const [isLoaded, setIsLoaded] = React.useState(false);
     React.useEffect(() => {
    // Load Mermaid from CDN and initialize diagrams
    const loadMermaid = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      script.async = true;
      script.onload = () => {
        // @ts-expect-error Mermaid library loaded dynamically from CDN
        window.mermaid?.contentLoaded();
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadMermaid();
  }, []);
    const mermaidDiagram = `
erDiagram
    TimeEntry {
        string diana_timeentryid PK
        string diana_name
        date diana_date
        number diana_duration
        number diana_value
        string _diana_milestone_value FK
        string _diana_projectid_value FK
    }
    Project {
        string diana_projectid PK
        string diana_name
        string diana_projectnumber
        date diana_startdate
    }
    Milestone {
        string diana_milestoneid PK
        string diana_name
        date diana_from
        date diana_to
        number diana_value
        string _diana_projectid_value FK
    }

    TimeEntry }o--|| Project : "belongs to"
    TimeEntry }o--|| Milestone : "associated with"
    Project ||--o{ Milestone : "has"
`;

    return (
        <div className={styles.diagramContainer}>
      <div className={styles.title}>Data Model - Table Relationships</div>
      <div className={styles.mermaidSvg}>
        <div className="mermaid">
          {mermaidDiagram}
        </div>
      </div>
    </div>
    );
};

export default GeneratedComponent;