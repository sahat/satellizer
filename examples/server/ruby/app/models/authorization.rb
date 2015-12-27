# == Schema Information
#
# Table name: authorizations
#
#  id         :integer          not null, primary key
#  provider   :string
#  uid        :string
#  token      :string
#  user_id    :integer
#  created_at :datetime
#  updated_at :datetime
#  secret     :string
#
# Indexes
#
#  index_authorizations_on_user_id  (user_id)
#

class Authorization < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :user_id, :uid, :provider
  validates_uniqueness_of :uid, scope: :provider

  scope :facebook, lambda { find_by(provider: 'facebook') }
  # after_create :fetch_details

  def fetch_details
    self.send("fetch_details_from_#{self.provider.downcase}")
  end

  def fetch_details_from_facebook
    graph = Koala::Facebook::API.new(self.token)
    profile = graph.get_object("me")
    user = self.user
    user.update_attributes(first_name: profile['first_name'], last_name: profile['last_name'],
                            address: profile["location"]["name"])
    
    user.save
  end

  def fetch_details_from_linkedin
  end

  def fetch_details_from_google_oauth2
  end

  def fetch_details_from_github
  end

end
