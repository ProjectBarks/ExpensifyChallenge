# Expensify Take-Home Challenge
*a simple description for your application*

## Instructions
### Remote
1. Open [ec2-18-224-71-196.us-east-2.compute.amazonaws.com](http://ec2-18-224-71-196.us-east-2.compute.amazonaws.com/) in the browser

### Locally
1. *write notes*

## Stack
* PHP
* jQuery
* *fill in rest* 

## Notes
1. Find some place to host a basic PHP environment. Some suggested services are AWS, Heroku, Cloud9, etc.. Make it publicly available so that we can try it out, and remember to remove it once your challenge review is done.
    * **Process:**
	    * hosted my server on AWS via the following [link](http://ec2-18-224-71-196.us-east-2.compute.amazonaws.com/).
	    * Using a basic LAMP server, I thought we needed to store items in the database but that was a bit overkill.
    * **Troubles Faced**: None. 
    * **Time to Complete**: 23 minutes
2. Building on top of the files we give you, comprise a single ajax-ified application. Do not use any MVCs or API libraries. We recommend creating a simple PHP API proxy file to get around any CORS issues with calling our API. You can access the files [here](https://gist.github.com/tgolen/bb147795f7beb978a0ae6f87884f32ae).
    * **Process:**
	    * Downloaded the files from the given link.
	    * Created a simple PHP API proxy called proxy.php with curl requests in about 10 minutes. I spent the rest of the
	    * time troubleshooting the POST requests.
    * **Troubles Faced:**
	    * Issues making the POST calls, but overcame this after inspecting the apache configuration file httpd.conf.
	    * Only GET requests were functional. As frustrating as it was, it is a nice refresher of apache httpd.conf.
    * **Time to Complete**: 45m
3. First, when loaded, if there is no "authToken" cookie set, the page should show a simple username/password form.  (if it is already set, the user is already logged in; skip to (6)).
    * **Process:**
	    * Wrote a checkAuthToken function which tries to locate the authToken cookie
	    * This function runs once the page is loaded
	    * This function will remove the login form and display the table + the transaction div
    * **Troubles Faced:** None
    * **Time to complete:** 15m
4. When you click "Sign In" it should, using AJAX, call the Authenticate function on the Expensify API. Details follow: [link](https://gist.github.com/mattabullock/b46feb100d4eea8153392e5ce6aa10d4) 
   * **Process:**
	   * I wrote a function called loginToExpensify which handles sending the parameters
	   * to the proxy script via a POST ajax request
   * **Troubles Faced:** None
   * **Time to complete:** 30m
```
Information
	partnerName: applicant
	partnerPassword: d7c3119c6cdab02d68d9
	partnerUserID: <email address>
	partnerUserSecret: <password>
Feel free to test using this account (but read the value from the form, don't hard-code it):
	email: expensifytest@mailinator.com
	password: hire_me
```

5. If Authentic Fails, it should show some meaningful error message and allow you to try again.
   * **Process**: I simply parse the error message and display the error
   * **Troubles Faced**: None
   * **Time to complete**: 10m

6. Upon success, use "Get" to get a list of all transactions in the account. Again, do this all via AJAX, without any page loads.  Download the entire data set and don't try to paginate or reduce the results.
    * **Process**: I wrote a function called getTransactionList which retrieves the information based on the user's auth token + the given transaction type
    * **Troubles Faced**: I initially had problems with getting the appends to work, but this was quickly resolved after I did inspection and appended the information where it needed to be.
    * **Time to complete**: 30m

7. With the "Get" results, assemble and display a table showing all transactions in the account. 
Make it pretty enough that real live users could reasonably understand it. It is a large dataset 
and we want to see your abilities at dealing with it in a performant way.

   * **Process**:
	   * I concerned myself with the speed first, so I created a tail recursive function that concatenates strings on a row-by-row basis.
	   * based on a chunking size of 500 which I found apt instead of 100 or 1000. 
	   * After I had this functionality working, I added css to the table to restrict the size and add borders around the rows.
   * **Troubles Faced**: None
   * **Time to complete:** 45m
 
8. Next, show a form that prompts the user for a date, merchant name, and amount. When the user clicks "Add" it calls 
"CreateTransaction" to create the new transaction, as well as adds it to the table.
   * **Process**:
	   * created the form and linked it all through javascript and jquery. 
	   * proxy.php has a create transaction function which is called if the post contains the createTransaction parameter.
   * **Troubles Faced:** None
   * **Time to complete:** 25m

9. Finally to prove that the "CreateTransaction" worked, let the user refresh the page. 
the authToken should be set, so it should just skip right (6), 
redownload the latests transactions, and show the full table.
   * **Process:**
	   * Created this functionality earlier in my work.
	   * it shows the full table. For fun, I added the new transaction so that the user doesn't have to refresh, but still pulls the information.
   * **Troubles Faced:** None
   * **Time to complete:** 30m

