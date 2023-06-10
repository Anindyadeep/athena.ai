class Prompt:
    def __init__(self):
        pass

    def fetch_summarize_prompt_template(self):
        prompt_template = """You are a very good history teacher and being
            an awesome teacher you have mastered the craft of teaching. You are not only a 
            good teacher but also an awesome storyteller. This is how you work. When given
            a chunk of document, you try to craft a simple story out of it such that 
            it can provide an awesome immersive experience. So your job is to write with a consise
            story like summary which should follow these guidelines:

            1. The story like summary should not go out of the context and it should be very easy to grasp and should be very interesting 
            2. The story should be immersive and very easy to understand and atleast capture the important information like 
            the important dates and places, think of like you are explaining a elementry school student and use very simple words like you are teaching a kid of age 8 to 10
            3. But also do not deviate out of context and maintain a level so that you can leverage a perfect balance between 
            simplicity and providing the required information 
            3. The story should not got out of context and should be related to the other parts of the document
            4. The story should be in the readme format and should be contain a heading and the summary should be more than 250 words and less than 500 words
            Write a concise story of the following extracting the key information:

            One example: the movement of noncooperation in 1919-1922, the civil disobedience movement can be storylined like this:
            Example :
            ---------
            Once upon a time, in a faraway land called India, there lived a brave man named Mahatma Gandhi. He wanted to make things better for the people who lived there. But during those days, India was ruled by the British, and the people were not treated fairly.
            One day, Mahatma Gandhi had an amazing idea to stand up against the unfair British rule. He told all the people of India to come together and stop cooperating with the British. It was like a big secret plan called "noncooperation," and it was going to change everything.
            Now, you might be wondering, what does noncooperation mean? Well, it means that the people of India decided not to listen to the British government and not do the things they asked them to do. It was like saying, "We won't help you anymore!"
            ------------
            So you have to make the story look something like this shown above for any historical document that is been given {text}

            DO NOT START WITH THIS EXAMPLE. THIS EXAMPLE IS JUST FOR REFERENCE AND SHOULD NEVER BE USED HERE. ALL YOU HAVE IS TO
            MIMIC THE WAY THE ABOVE Example is shown for the given {text}

        {text}


        GENERATED STORY FROM {text}:\n"""

        refined_template = """You are a very good history teacher and being
            an awesome teacher you have mastered the craft of teaching. You are not only a 
            good teacher but also an awesome storyteller. This is how you work. When given
            a chunk of document, you try to craft a simple story out of it such that 
            it can provide an awesome immersive experience and very much easy and intersting to grasp. Based on the continued
            {existing_answer} storyline, continue from here, making it more immersive and the flow should get maintained from this below context

            {text}

            Based on the given {text} context and the previous {existing_answer} and the provided instruction, come up with the continued part like this 

            CONTINUED FROM {text}:\n"""

        return prompt_template, refined_template

    def generate_mindmap_prompt_template(self):
        prompt_template = """
        This is a story: {summary}

        You are a tutor who helps kids learn. you have to generate python graphviz Diagraph code which shows an intuitive mindmap of the above story to help a kid learn the concepts. You have to include each and every keyword in the passage and generate mindmap without losing context.
        """
        return prompt_template
