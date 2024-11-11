import { FC } from "react";
import { cn } from "../../utils/cn";
const Refresh: FC<{ isLoading: boolean; enabled: boolean }> = ({
    enabled,
    isLoading,
}) => {
    return (
        <div data-testid="refresh-button" className="_refresher_wadtj_43">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="refresh_icon active"
            >
                <path
                    fill="currentColor"
                    d="M12 19.5c-4.125 0-7.5-3.375-7.5-7.5S7.875 4.5 12 4.5c2.063 0 3.937.875 5.25 2.25l-4 4H22V2l-2.937 2.938A9.97 9.97 0 0 0 12 2C6.5 2 2 6.5 2 12s4.437 10 10 10c4.605 0 8.425-3.076 9.625-7.273H18.98C17.915 17.543 15.165 19.5 12 19.5"
                ></path>
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className={cn(
                    "icon_overlay",
                    enabled
                        ? !isLoading
                            ? "overlay active progressing"
                            : "overlay active waiting"
                        : ""
                )}
                style={{
                    animationDuration: !isLoading ? "10000ms" : "1000ms",
                }}
            >
                <path
                    fill="currentColor"
                    d="M12 19.5c-4.125 0-7.5-3.375-7.5-7.5S7.875 4.5 12 4.5c2.063 0 3.937.875 5.25 2.25l-4 4H22V2l-2.937 2.938A9.97 9.97 0 0 0 12 2C6.5 2 2 6.5 2 12s4.437 10 10 10c4.605 0 8.425-3.076 9.625-7.273H18.98C17.915 17.543 15.165 19.5 12 19.5"
                ></path>
            </svg>
        </div>
    );
};

export default Refresh;
