import json

def remove_enrollments(json_file_path, output_file_path):
    """
    Removes all enrollments from student records in a JSON file.

    Args:
        json_file_path (str): Path to the input JSON file.
        output_file_path (str): Path to the output JSON file.
    """
    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)

        for student in data:
            student['enrollments'] = []

        with open(output_file_path, 'w') as f:
            json.dump(data, f, indent=2)  # indent for readability

        print(f"Enrollments removed and saved to {output_file_path}")

    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {json_file_path}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    input_file = 'students.json'  # Replace with your input file name
    output_file = 'students_no_enrollments.json'  # Replace with your desired output file name
    remove_enrollments(input_file, output_file)
