import os

def process_file(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()

    output_lines = []
    for line in lines:
        if line.startswith('<!-- REPLACEMENT'):
            path_start = line.find('src="') + len('src="')
            path_end = line.find('"', path_start)
            replacement_path = line[path_start:path_end]
            if not replacement_path.endswith('.md'):
                raise ValueError('Replacement file must have .md extension.')

            with open(replacement_path, 'r') as replacement_file:
                replacement_lines = replacement_file.readlines()

            output_lines.append(line)  # Add the REPLACEMENT comment
            output_lines.extend(replacement_lines)
            output_lines.append('\n')  # Add a blank line
            
            print(f"added: {replacement_path}")
        else:
            output_lines.append(line)

    with open(file_path, 'w') as output_file:
        output_file.writelines(output_lines)

file_path = 'README.md'
process_file(file_path)