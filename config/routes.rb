Neverbuilds::Application.routes.draw do
  resources :builds do
    collection do
      post :pick
      get :pick
    end
  end

  resources :users
  resources :sessions

  get "logout" => "sessions#destroy", :as => "logout"

  root :to => 'builds#index'
end
