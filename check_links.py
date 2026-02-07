import os
import re

def check_structure(directory):
    html_files = [f for f in os.listdir(directory) if f.endswith('.html')]
    report = []

    for filename in html_files:
        filepath = os.path.join(directory, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check for generic empty links
            empty_links = re.findall(r'<a[^>]+href=["\']#["\'][^>]*>', content)
            if empty_links:
                report.append(f"File: {filename} - Found {len(empty_links)} links with href='#'")

            # Check for truly empty hrefs
            blank_links = re.findall(r'<a[^>]+href=["\']["\'][^>]*>', content)
            if blank_links:
                report.append(f"File: {filename} - Found {len(blank_links)} links with href=''")
                
            # Check for header-v3 consistency (simple check)
            if 'header-v3.css' not in content and 'header-v3' not in content:
                 report.append(f"File: {filename} - Might differ from standard Header V3 (no header-v3 reference found)")

        except Exception as e:
            report.append(f"Error reading {filename}: {str(e)}")

    if not report:
        print("No broken links (href='#' or href='') found in HTML files.")
    else:
        print("Link Check Report:")
        for line in report:
            print(line)

if __name__ == "__main__":
    check_structure(os.getcwd())
