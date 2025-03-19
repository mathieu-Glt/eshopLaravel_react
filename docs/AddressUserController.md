# AddressUserController Documentation

## Overview

The `AddressUserController` handles all operations related to user addresses in the application. It provides methods for adding, removing, updating, and retrieving user addresses.

## Methods

### addAddress

```php
public function addAddress(Request $request)
```

Adds a new address for the authenticated user.

**Parameters:**

-   `$request` (Request): Contains the following fields:
    -   `address` (string): The street address
    -   `city` (string): The city name
    -   `zip_code` (string): The postal/zip code
    -   `country` (string): The country name

**Returns:**

-   JSON response with success message

**Example Response:**

```json
{
    "message": "Adresse ajoutée avec succès"
}
```

### removeAddress

```php
public function removeAddress(Request $request)
```

Removes a specific address for the authenticated user.

**Parameters:**

-   `$request` (Request): Contains the following field:
    -   `id` (integer): The ID of the address to remove

**Returns:**

-   JSON response with success message

**Example Response:**

```json
{
    "message": "Adresse supprimée avec succès"
}
```

### getAddresses

```php
public function getAddresses()
```

Retrieves all addresses for the authenticated user.

**Parameters:**

-   None

**Returns:**

-   JSON response containing an array of addresses

**Example Response:**

```json
[
    {
        "id": 1,
        "user_id": 1,
        "address": "123 Main St",
        "city": "Paris",
        "zip_code": "75001",
        "country": "France"
    }
]
```

### clearAddresses

```php
public function clearAddresses()
```

Removes all addresses for the authenticated user.

**Parameters:**

-   None

**Returns:**

-   JSON response with success message

**Example Response:**

```json
{
    "message": "Adresses supprimées avec succès"
}
```

### updateAddress

```php
public function updateAddress(Request $request)
```

Updates an existing address for the authenticated user.

**Parameters:**

-   `$request` (Request): Contains the following fields:
    -   `id` (integer): The ID of the address to update
    -   `address` (string): The new street address
    -   `city` (string): The new city name
    -   `zip_code` (string): The new postal/zip code
    -   `country` (string): The new country name

**Returns:**

-   JSON response with success message

**Example Response:**

```json
{
    "message": "Adresse mise à jour avec succès"
}
```

## Error Handling

All methods require authentication. If the user is not authenticated, they will receive a 401 Unauthorized response.

## Security

-   All methods are protected and require authentication
-   Users can only access and modify their own addresses
-   Input validation is performed on all requests

## Dependencies

-   Laravel Framework
-   Illuminate\Http\Request
-   Illuminate\Support\Facades\Auth
-   App\Models\AddressUser
