import React, { ReactNode } from "react";

// language=CSS
const STYLE = `
  * {
    box-sizing: border-box;
  }

  :root {
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.5;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th, td {
    padding: 8px;
  }
  
  th {
    text-align: left;
  }
`;

export const Page = ({
  content,
  title,
}: {
  content: ReactNode;
  title: string;
}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{title} - MyDNS</title>
        <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      </head>
      <body>
        <header>
          <h1>MyDNS</h1>
          <nav>
            <ul>
              <li>
                <a href="/AddList">Add list</a>
              </li>
            </ul>
          </nav>
        </header>
        <main>{content}</main>
      </body>
    </html>
  );
};
