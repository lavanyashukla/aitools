import streamlit as st
import os, asyncio
import weave
import sqlite3
import re
from openai import OpenAI


# do wandb login in the command line
weave.init('lavanyashukla/class-0524')

class SummarizeModel(weave.Model):
    system_prompt: str
    model: str = "gpt-3.5-turbo"
    temperature: float = 0.0
    
    @weave.op()
    def predict(self, question):
        client = OpenAI()
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": question}
        ]
        response = client.chat.completions.create(model=self.model, messages=messages, temperature=self.temperature)
        return response.choices[0].message.content.rstrip(';')


@weave.op()
def check_summary(model_output: str):
    """
    Check if the output contains a Summary with exactly 3 bullet points.
    
    Parameters:
    output (str): The text to be checked.
    
    Returns:
    bool: True if the summary format is correct, False otherwise.
    """
    output = model_output
    summary_pattern = r'Summary:\s*1\.\s*[\s\S]+?\s*2\.\s*[\s\S]+?\s*3\.\s*[\s\S]+'
    match = re.search(summary_pattern, output)
    if match:
        # Ensure there are exactly 3 bullet points
        bullet_points = match.group().strip().split('\n')
        return len(bullet_points) == 4  # 1 header + 3 bullet points
    return False

@weave.op()
def check_action_items(model_output: str):
    """
    Check if the output contains Action Items with Name, Due Dates, and Actions in the specified format.
    
    Parameters:
    output (str): The text to be checked.
    
    Returns:
    bool: True if the action items format is correct, False otherwise.
    """
    output = model_output
    action_items_pattern = r'Action Items:\s*(\d+\.\s+[a-zA-Z]+?\s+\(\d{4}-\d{2}-\d{2}\)\s+-\s+.+\s*)+'
    match = re.search(action_items_pattern, output)
    if match:
        action_items = match.group().strip().split('\n')[1:]  # Exclude header
        for item in action_items:
            if not re.match(r'\d+\.\s+[a-zA-Z]+?\s+\(\d{4}-\d{2}-\d{2}\)\s+-\s+.+', item):
                return False
        return True
    return False

data = [{'model_output': 
'''
Summary:
Performance improvements have been shipped for BigTablev3, Weave has been officially released with positive feedback, and several workspace changes have been made to improve interaction times.
Free Edition has been released to new customers, issues with the V2 run store have been addressed, and improvements have been made to the Artifact Lineage graph.
Key bugs have been fixed in various features, including run outliers and workspace functionalities, with upcoming developments including artifact metadata search and hiding personal entities for new users.
Action Items:

Team (May-end) - Target a solution for air-gapped deployments by May-end.
Team (Next week) - Complete team-level azure BYOB for dedicated and self-managed and ship with the May server release.
Team (Early Q2) - Ship the artifact metadata search in the UI.
'''
},]

@weave.op()
def run_sql_query(sql: str,db):
    return 

# Define Your Prompt as a single string, not a list
system_prompt = """
Your task is to generate summarize the text and extract action items, given some text input by the user. The text will be delimited by ```
Keep the summary to no more than 3 bullet points.

This is the format:
Text:
```
<TEXT>
```
Summary: 
1. 
2. 
3. 
Action Items: 
1. Name (Due date) - Action
2. Name (Due date) - Action
3. Name (Due date) - Action
... (all other action items)
"""

# evaluation = weave.Evaluation(name='SummarizeEval', dataset=data, scorers=[check_summary, check_action_items])
model = SummarizeModel(system_prompt=system_prompt)
# res = evaluation.evaluate(model)
# print(asyncio.run(evaluation.evaluate(model)))

## Streamlit App
st.set_page_config(page_title="AITools")
st.header("AITools. Summarize")
st.write("Enter some text below to extract a 3-point summary + action items.")
question = st.text_area(label ="Your Text", key="input", label_visibility="hidden", value="Some text here...", height=300)
submit = st.button("Summarize")

# if submit is clicked
if submit:
    # call the model
    response = model.predict(question)
    st.subheader("Summary")
    st.write(response)