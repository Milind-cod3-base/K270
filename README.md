# Health Monitoring IoT Device Application

## Section 1: Installation (Only One Time Setup)

1. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

## Section 2: Running

1. Navigate to the `MyWork` folder:
   

2. Initiate the virtual environment:
    ```bash
    .\venv\Scripts\activate
    ```

3. Use the following script for hosting on a local machine:
    ```bash
    flask run
    ```
	This will show IP similar to: http://127.0.0.1:5000. Use this in the same device's browser of your choice.

4. Use the following script for hosting on a LAN:
    ```bash
    flask run --host=0.0.0.0
    ```
	This will show IP similar to: http://192.168.178.67:5000. Use this in a LAN connected device's browser of your choice.
	
## Section 3: Testing (While the server is running in one terminal, open another cmd)

1. Navigate to MyWork\ folder

2. Activate Virtual environment again this new terminal:
	
	```bash
    .\venv\Scripts\activate
    ```
3. Navigate to MyWork\tests\ folder

4. Run python script, and monitor the browser on your screen:
	```bash
	 python send_data_OneSecond.py
    ```
	
	