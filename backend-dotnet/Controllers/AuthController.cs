using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // Hard-coded credentials for testing
    private const string VALID_PHONE = "1234567890";
    private const string VALID_OTP = "1234";
    private const string VALID_EMAIL = "admin@example.com";
    private const string VALID_PASSWORD = "admin123";
    private const string ADMIN_NAME = "Admin User";

    [HttpPost("login/phone")]
    public async Task<IActionResult> LoginWithPhone([FromBody] PhoneLoginRequest request)
    {
        if (request.Phone == VALID_PHONE && request.Otp == VALID_OTP)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, request.Phone),
                new Claim(ClaimTypes.NameIdentifier, request.Phone),
                new Claim("UserType", "User")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30)
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            HttpContext.Session.SetString("UserId", request.Phone);
            HttpContext.Session.SetString("UserType", "User");

            return Ok(new { success = true, message = "Login successful" });
        }

        return Unauthorized(new { success = false, message = "Invalid phone or OTP" });
    }

    [HttpPost("login/admin")]
    public async Task<IActionResult> LoginWithEmail([FromBody] EmailLoginRequest request)
    {
        if (request.Email == VALID_EMAIL && request.Password == VALID_PASSWORD)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, ADMIN_NAME),
                new Claim(ClaimTypes.Email, request.Email),
                new Claim(ClaimTypes.NameIdentifier, request.Email),
                new Claim("UserType", "Admin")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30)
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            HttpContext.Session.SetString("UserId", request.Email);
            HttpContext.Session.SetString("UserType", "Admin");
            HttpContext.Session.SetString("AdminName", ADMIN_NAME);

            return Ok(new { success = true, message = "Login successful", adminName = ADMIN_NAME });
        }

        return Unauthorized(new { success = false, message = "Invalid email or password" });
    }

    [HttpGet("session")]
    public IActionResult GetSession()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            var userType = HttpContext.Session.GetString("UserType");
            var adminName = HttpContext.Session.GetString("AdminName");
            
            return Ok(new
            {
                authenticated = true,
                userName = User.Identity.Name,
                userType = userType,
                adminName = adminName
            });
        }

        return Ok(new { authenticated = false });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        HttpContext.Session.Clear();
        return Ok(new { success = true, message = "Logged out successfully" });
    }
}

public class PhoneLoginRequest
{
    public string Phone { get; set; } = string.Empty;
    public string Otp { get; set; } = string.Empty;
}

public class EmailLoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

