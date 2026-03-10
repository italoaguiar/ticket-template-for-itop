
# Ticket Template Extension for iTop

  

This extension adds a per-subcategory template that is automatically inserted into the ticket description in the iTop user portal. It is designed for iTop 3.2.x and the standard portal.
![Portal](/docs/img/portal.png)

![Portal](/docs/img/subcategory.png)

## How it works (step by step)

  

1.  **Data model**: Adds the `ticket_template` attribute to `ServiceSubcategory` in [datamodel.ticket-template.xml](datamodel.ticket-template.xml).

2.  **Portal hook**: Loads a small JavaScript file in the user portal via `PortalUIExtension` (declared in [module.ticket-template.php](module.ticket-template.php)).

3.  **Modal event**: When the ticket creation modal is shown, the script looks for the selected subcategory.

4.  **Endpoint call**: It calls the extension endpoint to fetch the template for that subcategory.

5.  **Editor fill**: If the description editor is empty, it inserts the template.

  

## Installation

  

1. Copy the `ticket-template` folder into your iTop `extensions/` directory.

2. Run iTop setup to compile the data model and update the database.

3. (Optional) Run Composer in the extension folder if you add more PHP classes:

  

```

composer dump-autoload -o

```

  

## Configuration

  

- Edit each `ServiceSubcategory` and set the **Ticket template** field.

- The portal will inject it into the description when the creation modal opens.

  

## Files of interest

  

- [ajax/ticket-template.php](ajax/ticket-template.php) - Endpoint that returns the template.

- [assets/js/portal-ticket-template.js](assets/js/portal-ticket-template.js) - Portal logic.

- [src/Hook/PortalUIExtension.php](src/Hook/PortalUIExtension.php) - Portal hook.

  

## Contributing

  

Contributions are welcome! If you want to improve this extension, please:

  

1. Fork the repository.

2. Create a feature branch.

3. Commit your changes with clear messages.

4. Open a pull request describing what you changed and why.

  

If you are unsure about an approach, open an issue first and we can discuss it.