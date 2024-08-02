# Health Monitoring IoT Device Application

## Section 1: Installation (Only One Time Setup)

Note: Only applicable for Windows OS 

1. Enter the root folder ./K270

2. Create a virtual environment:
    ```bash
    python -m venv .venv
    ``` 

2. Activate the venv:
	```bash
    .\.venv\Scripts\activate
    ```

3. Updgrade pip:
	```bash
    python -m pip install --upgrade pip
    ```

4. Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```

## Section 2: Running

Note: Only applicable for Windows OS 

1. Initiate the virtual environment:
    ```bash
    .\.venv\Scripts\activate
    ```

2. Use the following script for hosting on a local machine:
    ```bash
	set FLASK_APP=app
    set FLASK_ENV=development
    flask run
    ```
	This will show IP similar to: http://127.0.0.1:5000. Use this in the same device's browser of your choice.

3. Use the following script for hosting on a LAN:
    ```bash
	set FLASK_APP=app
    set FLASK_ENV=development
    flask run --host=0.0.0.0
    ```
	This will show IP similar to: http://192.168.178.67:5000. Use this in a LAN connected device's browser of your choice.
	
## Section 3: Testing (While the server is running in one terminal, open another cmd)

Note: Only applicable for Windows OS 

1. Activate Virtual environment again this new terminal:
	
	```bash
    .\venv\Scripts\activate
    ```
2. Navigate to .\tests\ 

3. Run python script, and monitor the browser on your screen. Following script will send 10 dummy sensor data to populate the database, and hence updates the UI in real-time:
	```bash
	 python send_data_OneSecond.py
    ```
	
	