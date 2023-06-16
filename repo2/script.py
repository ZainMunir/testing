questions = [
    "Describe, with your own words, what the project is about. Also, include in such a description the history of the project in terms of age, number of commits in the main branch, and number of collaborators.",
    "What are the practices in terms of commit messages (consider only commits on the main branch)?",
    "How are the issues organized?",
    "Are there instructions on how to contribute to the project? If yes, explain them.",
    "What automated checks exist on a commit pushed to the main branch?",
    "In the context of pull requests, what automated checks are done (consider checks on commits and comments posted in the pull requests by automated tools and bots)?",
    "How are the release notes organized?",
    "What is the license of the project? Explain if it’s permissive or restrictive."
]

file_names = ['q1.md', 'q2.md', 'q3.md', 'q4.md', 'q5.md', 'q6.md', 'q7.md', 'q8.md']

for i in range(len(questions)):
    with open(file_names[i], 'w') as file:
        file.write(f'<details>\n   <summary>\n      {i+1}. {questions[i]}\n</summary>\n\n\n\n</details>')
