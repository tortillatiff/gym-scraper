from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import datetime
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ActiveSGSeleniumScraper:
    def __init__(self):
        self.base_url = "https://activesg.gov.sg/gym-capacity"
        
    def setup_driver(self):
        """Set up Chrome driver with options"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Run in background
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return driver
    
    def scrape_capacity(self):
        """Scrape gym capacity data using Selenium"""
        driver = None
        try:
            logger.info("Setting up browser...")
            driver = self.setup_driver()
            
            logger.info("Navigating to gym capacity page...")
            driver.get(self.base_url)
            
            # Wait for page to load
            time.sleep(5)
            
            # Wait for gym cards to be present
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "chakra-card"))
            )
            
            logger.info("Page loaded, extracting gym data...")
            
            # Find all gym cards
            gym_cards = driver.find_elements(By.CLASS_NAME, "chakra-card")
            logger.info(f"Found {len(gym_cards)} gym cards")
            
            gyms_data = []
            
            for card in gym_cards:
                try:
                    # Extract gym name
                    name_element = card.find_element(By.CSS_SELECTOR, "p.chakra-text")
                    gym_name = name_element.text.strip()
                    
                    # Extract capacity percentage
                    badge_element = card.find_element(By.CSS_SELECTOR, "span.chakra-badge")
                    capacity_text = badge_element.text.strip()
                    
                    # Parse percentage
                    percentage = self.parse_percentage(capacity_text)
                    
                    gym_data = {
                        'name': gym_name,
                        'percentage_full': percentage,
                        # Add 8 hours to UTC to get SGT
                        'timestamp': (datetime.datetime.now() + datetime.timedelta(hours=8)).isoformat()
                        'status': self.get_capacity_status(percentage)
                    }
                    
                    gyms_data.append(gym_data)
                    logger.info(f"Scraped: {gym_name} - {percentage}% full")
                    
                except Exception as e:
                    logger.error(f"Error extracting data from gym card: {e}")
                    continue
            
            return gyms_data
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            return None
        finally:
            if driver:
                driver.quit()
    
    def parse_percentage(self, capacity_text):
        """Extract percentage from capacity text (e.g., '40% full' -> 40.0)"""
        import re
        percentage_match = re.search(r'(\d+)%', capacity_text)
        return float(percentage_match.group(1)) if percentage_match else 0.0
    
    def get_capacity_status(self, percentage):
        """Categorize gym capacity status"""
        if percentage < 30:
            return "Low"
        elif percentage < 70:
            return "Medium"
        else:
            return "High"
    
    def load_existing_data(self, filename='gym_capacity_data.json'):
        """Load existing data from JSON file"""
        try:
            with open(filename, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.info("No existing data file found, starting fresh")
            return []
        except json.JSONDecodeError:
            logger.error("Invalid JSON file, starting fresh")
            return []
    
    def save_data(self, new_data, filename='gym_capacity_data.json'):
        """Save data to JSON file"""
        if not new_data:
            logger.warning("No new data to save")
            return
        
        # Load existing data
        all_data = self.load_existing_data(filename)
        
        # Add timestamp to the new data entry
        entry = {
            # Add 8 hours to UTC to get SGT
            'timestamp': (datetime.datetime.now() + datetime.timedelta(hours=8)).isoformat()
            'gyms': new_data
        }
        
        all_data.append(entry)
        
        # Keep only last 30 days of data (720 entries for hourly data)
        if len(all_data) > 720:
            all_data = all_data[-720:]
        
        # Save to file
        try:
            with open(filename, 'w') as f:
                json.dump(all_data, f, indent=2)
            logger.info(f"Data saved successfully. Total entries: {len(all_data)}")
        except Exception as e:
            logger.error(f"Error saving data: {e}")
    
    def run(self):
        """Main scraping function"""
        logger.info("Starting ActiveSG gym capacity scraper (Selenium)...")
        
        # Scrape current data
        capacity_data = self.scrape_capacity()
        
        if capacity_data:
            # Save data
            self.save_data(capacity_data)
            
            # Print summary
            print(f"Successfully scraped {len(capacity_data)} gyms at {datetime.datetime.now()}")
            for gym in capacity_data:
                print(f"  {gym['name']}: {gym['percentage_full']}% full - {gym['status']}")
        else:
            logger.error("Failed to scrape data")

def main():
    scraper = ActiveSGSeleniumScraper()
    scraper.run()

if __name__ == "__main__":
    main()
