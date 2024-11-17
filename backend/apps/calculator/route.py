from fastapi import APIRouter
import base64
from io import BytesIO
from apps.calculator.utils import analyze_image
from schema import ImageData
from PIL import Image

router = APIRouter()

@router.post('')
async def run(data: ImageData):
    try:
        # Log the base64 data received (ensure it's valid)

        # Decode the base64 image data
        image_data = base64.b64decode(data.image.split(",")[1])
        image_bytes = BytesIO(image_data)
        image = Image.open(image_bytes)

        # Check if image is opened correctly


        # Save the image temporarily for debugging purposes

        # Process the image using analyze_image function
        responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
        print("Responses from analyze_image:", responses)

        if not responses or len(responses) == 0:
            return {"message": "No valid data received", "data": ['error in fetching data'], "status": "failure"}

        return {"message": "Image processed", "data": responses, "status": "success"}

    except Exception as e:
        # Log any error that occurred during the image processing
        print("Error processing image:", e)
        return {"message": "Error processing image", "data": ['error in processing image'], "status": "failure"}

